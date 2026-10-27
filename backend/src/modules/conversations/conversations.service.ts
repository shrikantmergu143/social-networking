import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { ConversationParticipant } from './entities/conversation-participant.entity';
import { ChatMessage } from '../messages/entities/chat-message.entity';
import { User } from '../users/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationTargetType, NotificationType } from '../../shared/entity/enum';
import { UserFollow } from '../users/entities/user-follow.entity';
import { MessageStatus } from '../../shared/entity/enum';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation) private readonly conversations: Repository<Conversation>,
    @InjectRepository(ConversationParticipant) private readonly participants: Repository<ConversationParticipant>,
    @InjectRepository(ChatMessage) private readonly messages: Repository<ChatMessage>,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(UserFollow) private readonly follows: Repository<UserFollow>,
    private readonly notifications: NotificationsService,
  ) {}

  async list(userId: string) {
    const rows = await this.participants.find({
      where: { userId },
      relations: { conversation: { participants: { user: true }, messages: { sender: true, receipts: true } } },
    });
    return rows.map(({ conversation }) => {
      const other = conversation.participants.find(participant => participant.userId !== userId)?.user;
      if (!other) return null;
      const last = [...conversation.messages].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
      const own = conversation.participants.find(participant => participant.userId === userId);
      return {
        id: conversation.id,
        participant: this.profile(other),
        lastMessage: last ? this.message(last) : undefined,
        unreadCount: conversation.messages.filter(message => {
          if (message.senderId === userId) return false;
          const receipt = message.receipts?.find(item => item.userId === userId);
          return receipt ? !receipt.readAt : !own?.lastReadAt || message.createdAt > own.lastReadAt;
        }).length,
        updatedAt: conversation.updatedAt.toISOString(),
      };
    }).filter?.(Boolean).sort((a: any, b: any) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async open(userId: string, otherUserId: string) {
    if (userId === otherUserId) throw new NotFoundException('Cannot start a conversation with yourself.');
    const other = await this.users.findOneBy({ id: otherUserId });
    if (!other) throw new NotFoundException('User not found.');
    if (other.isPrivate && !(await this.follows.exists({ where: { followerId: userId, followingId: otherUserId } }))) {
      throw new ForbiddenException('Follow this private profile and wait for approval before sending a message.');
    }
    const ownRows = await this.participants.find({ where: { userId } });
    for (const own of ownRows) {
      const counterpart = await this.participants.findOneBy({ conversationId: own.conversationId, userId: otherUserId });
      if (counterpart) return { id: own.conversationId };
    }
    const conversation = await this.conversations.save(this.conversations.create());
    await this.participants.save([
      this.participants.create({ conversationId: conversation.id, userId }),
      this.participants.create({ conversationId: conversation.id, userId: otherUserId }),
    ]);
    await this.notifications.create({
      userId: otherUserId,
      actorId: userId,
      type: NotificationType.MESSAGE,
      text: 'started a conversation with you',
      targetId: conversation.id,
      targetType: NotificationTargetType.CONVERSATION,
    });
    return { id: conversation.id };
  }

  private profile(user: User) {
    return {
      id: user.id, username: user.username, fullName: user.fullName, age: 18,
      gender: user.gender, location: user.location ?? '', distanceKm: 0, bio: user.bio,
      avatar: user.avatar ?? '', coverImage: user.coverImage ?? '', photos: [], interests: [],
      relationshipGoal: user.relationshipGoal, lifestyle: {}, isVerified: user.isVerified,
      isOnline: user.isOnline, lastActive: user.lastActive?.toISOString() ?? '',
      followerCount: 0, followingCount: 0, postCount: 0,
    };
  }

  private message(message: ChatMessage) {
    const recipientReceipts = (message.receipts ?? [])
      .filter(receipt => receipt.userId !== message.senderId);
    const status = recipientReceipts.length && recipientReceipts.every(receipt => receipt.readAt)
      ? MessageStatus.READ
      : recipientReceipts.length && recipientReceipts.every(receipt => receipt.deliveredAt)
        ? MessageStatus.DELIVERED
        : MessageStatus.SENT;
    return {
      id: message.id, conversationId: message.conversationId, senderId: message.senderId,
      text: message.text, timestamp: message.createdAt.toISOString(), status,
      imageUrl: message.imageUrl ?? undefined,
      receipts: (message.receipts ?? []).map(receipt => ({
        messageId: receipt.messageId,
        userId: receipt.userId,
        deliveredAt: receipt.deliveredAt?.toISOString() ?? null,
        readAt: receipt.readAt?.toISOString() ?? null,
      })),
    };
  }
}
