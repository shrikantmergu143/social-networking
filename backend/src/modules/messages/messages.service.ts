import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { Conversation } from '../conversations/entities/conversation.entity';
import { ConversationParticipant } from '../conversations/entities/conversation-participant.entity';
import { NotificationsService } from '../notifications/notifications.service';
import {
  MessageStatus,
  NotificationTargetType,
  NotificationType,
} from '../../shared/entity/enum';
import { User } from '../users/entities/user.entity';
import { UserFollow } from '../users/entities/user-follow.entity';
import { ChatGateway } from './chat.gateway';
import { MessageReceipt } from './entities/message-receipt.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly messages: Repository<ChatMessage>,
    @InjectRepository(MessageReceipt)
    private readonly receipts: Repository<MessageReceipt>,
    @InjectRepository(Conversation)
    private readonly conversations: Repository<Conversation>,
    @InjectRepository(ConversationParticipant)
    private readonly participants: Repository<ConversationParticipant>,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(UserFollow)
    private readonly follows: Repository<UserFollow>,
    private readonly notifications: NotificationsService,
    private readonly chatGateway: ChatGateway,
  ) {}

  async list(userId: string, conversationId: string) {
    await this.assertParticipant(userId, conversationId);
    await this.assertCanMessagePrivateProfile(userId, conversationId);
    const incomingMessageIds = (
      await this.messages.find({
        where: { conversationId },
        select: { id: true, senderId: true },
      })
    )
      .filter((message) => message.senderId !== userId)
      .map((message) => message.id);
    const pendingDelivery = incomingMessageIds.length
      ? await this.receipts.find({
          where: {
            userId,
            deliveredAt: IsNull(),
            messageId: In(incomingMessageIds),
          },
        })
      : [];
    if (pendingDelivery.length) {
      const pendingReceiptIds = pendingDelivery.map((receipt) => receipt.id);
      await this.receipts
        .createQueryBuilder()
        .update(MessageReceipt)
        .set({
          deliveredAt: () => 'COALESCE("delivered_at", CURRENT_TIMESTAMP)',
        })
        .where('"id" IN (:...receiptIds)', { receiptIds: pendingReceiptIds })
        .execute();
      const deliveredReceipts = await this.receipts.findBy({
        id: In(pendingReceiptIds),
      });
      await this.messages.update(
        {
          id: In(pendingDelivery.map((receipt) => receipt.messageId)),
          status: MessageStatus.SENT,
        },
        { status: MessageStatus.DELIVERED },
      );
      await this.chatGateway.emitMessageReceipts(
        conversationId,
        deliveredReceipts.map((receipt) => this.toReceipt(receipt)),
      );
    }

    const messages = await this.messages.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
      relations: { sender: true, receipts: true },
    });
    return messages.map((message) => this.toMessage(message));
  }

  async markRead(userId: string, conversationId: string) {
    await this.assertParticipant(userId, conversationId);
    await this.assertCanMessagePrivateProfile(userId, conversationId);

    const readAt = new Date();
    await this.participants.update(
      { conversationId, userId },
      { lastReadAt: readAt },
    );
    const incomingMessages = await this.messages.find({
      where: { conversationId },
      select: { id: true, senderId: true },
    });
    const incomingMessageIds = incomingMessages
      .filter((message) => message.senderId !== userId)
      .map((message) => message.id);
    if (incomingMessageIds.length) {
      const existingReceipts = await this.receipts.find({
        where: { messageId: In(incomingMessageIds), userId },
      });
      const readReceiptIds = new Set(
        existingReceipts.map((receipt) => receipt.messageId),
      );
      const receiptsToSave = [
        ...existingReceipts.filter(receipt => !receipt.readAt),
        ...incomingMessageIds
          .filter((messageId) => !readReceiptIds.has(messageId))
          .map((messageId) => this.receipts.create({ messageId, userId })),
      ];
      if (receiptsToSave.length) {
        const missingReceipts = receiptsToSave.filter((receipt) => !receipt.id);
        if (missingReceipts.length) await this.receipts.save(missingReceipts);
        await this.receipts
          .createQueryBuilder()
          .update(MessageReceipt)
          .set({
            deliveredAt: () => 'COALESCE("delivered_at", CURRENT_TIMESTAMP)',
            readAt: () => 'COALESCE("read_at", CURRENT_TIMESTAMP)',
          })
          .where('"message_id" IN (:...messageIds)', {
            messageIds: incomingMessageIds,
          })
          .andWhere('"user_id" = :userId', { userId })
          .execute();
        const persistedReceipts = await this.receipts.find({
          where: { messageId: In(incomingMessageIds), userId },
        });
        await this.chatGateway.emitMessageReceipts(
          conversationId,
          persistedReceipts.map((receipt) => this.toReceipt(receipt)),
        );
      }
    }
    return { conversationId, readerId: userId, readAt: readAt.toISOString() };
  }

  async send(
    userId: string,
    conversationId: string,
    body: { text?: string; imageUrl?: string },
  ) {
    await this.assertParticipant(userId, conversationId);
    await this.assertCanMessagePrivateProfile(userId, conversationId);
    if (!body.text?.trim() && !body.imageUrl) {
      throw new BadRequestException('Message text or image is required.');
    }
    const conversationParticipants = await this.participants.find({
      where: { conversationId },
      select: { userId: true },
    });
    const message = await this.messages.save(
      this.messages.create({
        conversationId,
        senderId: userId,
        text: body.text?.trim() ?? '',
        imageUrl: body.imageUrl ?? null,
      }),
    );
    message.receipts = await this.receipts.save(
      conversationParticipants.map((participant) =>
        this.receipts.create({
          messageId: message.id,
          userId: participant.userId,
          deliveredAt: participant.userId === userId ? message.createdAt : null,
          readAt: null,
        }),
      ),
    );
    await this.conversations.update(
      { id: conversationId },
      { updatedAt: new Date() },
    );
    await this.chatGateway.emitMessage(this.toMessage(message));
    await Promise.all(
      conversationParticipants
        .filter?.((participant) => participant.userId !== userId)
        .map((participant) =>
          this.notifications.create({
            userId: participant.userId,
            actorId: userId,
            type: NotificationType.MESSAGE,
            text: 'sent you a message',
            targetId: conversationId,
            targetType: NotificationTargetType.CONVERSATION,
          }),
        ),
    );
    return this.toMessage(message);
  }

  private async assertParticipant(userId: string, conversationId: string) {
    const participant = await this.participants.findOneBy({
      conversationId,
      userId,
    });
    if (!participant)
      throw new ForbiddenException(
        'You are not a participant in this conversation.',
      );
  }

  private async assertCanMessagePrivateProfile(
    userId: string,
    conversationId: string,
  ) {
    const recipientId = (
      await this.participants.find({
        where: { conversationId },
        select: { userId: true },
      })
    ).find((participant) => participant.userId !== userId)?.userId;
    if (!recipientId)
      throw new ForbiddenException('Conversation recipient was not found.');
    const recipient = await this.users.findOneBy({ id: recipientId });
    if (
      recipient?.isPrivate &&
      !(await this.follows.exists({
        where: { followerId: userId, followingId: recipientId },
      }))
    ) {
      throw new ForbiddenException(
        'You must be an approved follower to view or send messages to this private profile.',
      );
    }
  }

  private toMessage(message: ChatMessage) {
    const recipientReceipts = (message.receipts ?? []).filter(
      (receipt) => receipt.userId !== message.senderId,
    );
    const status =
      recipientReceipts.length &&
      recipientReceipts.every((receipt) => receipt.readAt)
        ? MessageStatus.READ
        : recipientReceipts.length &&
            recipientReceipts.every((receipt) => receipt.deliveredAt)
          ? MessageStatus.DELIVERED
          : MessageStatus.SENT;
    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      text: message.text,
      timestamp: message.createdAt.toISOString(),
      status,
      imageUrl: message.imageUrl ?? undefined,
      receipts: (message.receipts ?? []).map((receipt) =>
        this.toReceipt(receipt),
      ),
    };
  }

  private toReceipt(receipt: MessageReceipt) {
    return {
      messageId: receipt.messageId,
      userId: receipt.userId,
      deliveredAt: receipt.deliveredAt?.toISOString() ?? null,
      readAt: receipt.readAt?.toISOString() ?? null,
    };
  }
}
