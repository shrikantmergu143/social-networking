import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { Conversation } from '../conversations/entities/conversation.entity';
import { ConversationParticipant } from '../conversations/entities/conversation-participant.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationTargetType, NotificationType } from '../../shared/entity/enum';
import { User } from '../users/entities/user.entity';
import { UserFollow } from '../users/entities/user-follow.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(ChatMessage) private readonly messages: Repository<ChatMessage>,
    @InjectRepository(Conversation) private readonly conversations: Repository<Conversation>,
    @InjectRepository(ConversationParticipant) private readonly participants: Repository<ConversationParticipant>,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(UserFollow) private readonly follows: Repository<UserFollow>,
    private readonly notifications: NotificationsService,
  ) {}

  async list(userId: string, conversationId: string) {
    await this.assertParticipant(userId, conversationId);
    await this.assertCanMessagePrivateProfile(userId, conversationId);
    const messages = await this.messages.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
      relations: { sender: true },
    });
    await this.participants.update({ conversationId, userId }, { lastReadAt: new Date() });
    return messages.map(message => this.toMessage(message));
  }

  async send(userId: string, conversationId: string, body: { text?: string; imageUrl?: string }) {
    await this.assertParticipant(userId, conversationId);
    await this.assertCanMessagePrivateProfile(userId, conversationId);
    if (!body.text?.trim() && !body.imageUrl) {
      throw new BadRequestException('Message text or image is required.');
    }
    const message = await this.messages.save(this.messages.create({
      conversationId,
      senderId: userId,
      text: body.text?.trim() ?? '',
      imageUrl: body.imageUrl ?? null,
    }));
    await this.conversations.update({ id: conversationId }, { updatedAt: new Date() });
    const recipients = await this.participants.find({
      where: { conversationId },
      select: { userId: true },
    });
    await Promise.all(recipients
      .filter?.(participant => participant.userId !== userId)
      .map(participant => this.notifications.create({
        userId: participant.userId,
        actorId: userId,
        type: NotificationType.MESSAGE,
        text: 'sent you a message',
        targetId: conversationId,
        targetType: NotificationTargetType.CONVERSATION,
      })));
    return this.toMessage(message);
  }

  private async assertParticipant(userId: string, conversationId: string) {
    const participant = await this.participants.findOneBy({ conversationId, userId });
    if (!participant) throw new ForbiddenException('You are not a participant in this conversation.');
  }

  private async assertCanMessagePrivateProfile(userId: string, conversationId: string) {
    const recipientId = (await this.participants.find({
      where: { conversationId },
      select: { userId: true },
    })).find(participant => participant.userId !== userId)?.userId;
    if (!recipientId) throw new ForbiddenException('Conversation recipient was not found.');
    const recipient = await this.users.findOneBy({ id: recipientId });
    if (recipient?.isPrivate && !(await this.follows.exists({ where: { followerId: userId, followingId: recipientId } }))) {
      throw new ForbiddenException('You must be an approved follower to view or send messages to this private profile.');
    }
  }

  private toMessage(message: ChatMessage) {
    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      text: message.text,
      timestamp: message.createdAt.toISOString(),
      status: message.status,
      imageUrl: message.imageUrl ?? undefined,
    };
  }
}
