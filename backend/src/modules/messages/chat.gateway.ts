import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { MessageStatus } from '../../shared/entity/enum';
import { ConversationParticipant } from '../conversations/entities/conversation-participant.entity';
import { User } from '../users/entities/user.entity';
import { UserFollow } from '../users/entities/user-follow.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { MessageReceipt } from './entities/message-receipt.entity';

interface AuthenticatedSocket extends Socket {
  data: {
    userId?: string;
  };
}

interface TypingPayload {
  conversationId: string;
  isTyping: boolean;
}

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',').map(origin => origin.trim()) ?? true,
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Server;

  constructor(
    private readonly jwt: JwtService,
    @InjectRepository(ConversationParticipant)
    private readonly participants: Repository<ConversationParticipant>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(UserFollow)
    private readonly follows: Repository<UserFollow>,
    @InjectRepository(ChatMessage)
    private readonly messages: Repository<ChatMessage>,
    @InjectRepository(MessageReceipt)
    private readonly receipts: Repository<MessageReceipt>,
  ) {}

  async handleConnection(socket: AuthenticatedSocket) {
    const token = socket.handshake.auth?.token;
    if (typeof token !== 'string' || !token) {
      socket.disconnect(true);
      return;
    }

    try {
      const payload = await this.jwt.verifyAsync<{ sub: string; email: string }>(token);
      if (!payload.sub || !payload.email) {
        socket.disconnect(true);
        return;
      }

      socket.data.userId = payload.sub;
      await socket.join(this.userRoom(payload.sub));
    } catch {
      socket.disconnect(true);
    }
  }

  @SubscribeMessage('join_conversation')
  async joinConversation(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() conversationId: string,
  ) {
    const userId = socket.data.userId;
    if (!userId || typeof conversationId !== 'string') return { joined: false };
    if (!(await this.canAccessConversation(userId, conversationId))) return { joined: false };

    await socket.join(conversationId);
    return { joined: true };
  }

  @SubscribeMessage('leave_conversation')
  async leaveConversation(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() conversationId: string,
  ) {
    if (typeof conversationId === 'string') await socket.leave(conversationId);
    return { left: true };
  }

  @SubscribeMessage('typing')
  async typing(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() payload: TypingPayload,
  ) {
    const userId = socket.data.userId;
    if (!userId || typeof payload?.conversationId !== 'string') return;
    if (!(await this.canAccessConversation(userId, payload.conversationId))) return;

    socket.to(payload.conversationId).emit('typing', {
      conversationId: payload.conversationId,
      isTyping: Boolean(payload.isTyping),
      senderId: userId,
    });
  }

  @SubscribeMessage('message_delivered')
  async messageDelivered(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() messageId: string,
  ) {
    const userId = socket.data.userId;
    if (!userId || typeof messageId !== 'string') return;

    const message = await this.messages.findOneBy({ id: messageId });
    if (!message || message.senderId === userId) return;
    if (!(await this.canAccessConversation(userId, message.conversationId))) return;

    const receipt = await this.receipts.findOneBy({ messageId, userId });
    if (!receipt || receipt.deliveredAt) return;

    await this.receipts
      .createQueryBuilder()
      .update(MessageReceipt)
      .set({ deliveredAt: () => 'COALESCE("delivered_at", CURRENT_TIMESTAMP)' })
      .where('"message_id" = :messageId', { messageId })
      .andWhere('"user_id" = :userId', { userId })
      .execute();
    const persistedReceipt = await this.receipts.findOneBy({ messageId, userId });
    if (!persistedReceipt) return;
    await this.messages.update(
      { id: messageId, status: MessageStatus.SENT },
      { status: MessageStatus.DELIVERED },
    );
    await this.emitMessageReceipts(message.conversationId, [this.toReceipt(persistedReceipt)]);
  }

  async emitMessage(message: {
    id: string;
    conversationId: string;
    senderId: string;
    text: string;
    timestamp: string;
    status: string;
    imageUrl?: string;
    receipts: Array<{
      userId: string;
      deliveredAt: string | null;
      readAt: string | null;
    }>;
  }) {
    if (!this.server) return;

    const participants = await this.participants.find({
      where: { conversationId: message.conversationId },
      select: { userId: true },
    });
    for (const participant of participants) {
      if (await this.canAccessConversation(participant.userId, message.conversationId)) {
        this.server.to(this.userRoom(participant.userId)).emit('receive_message', message);
      }
    }
  }

  async emitMessageReceipts(
    conversationId: string,
    receipts: Array<{ messageId: string; userId: string; deliveredAt: string | null; readAt: string | null }>,
  ) {
    if (!this.server || !receipts.length) return;

    const participants = await this.participants.find({
      where: { conversationId },
      select: { userId: true },
    });
    const event = {
      conversationId,
      receipts,
    };
    for (const participant of participants) {
      if (await this.canAccessConversation(participant.userId, conversationId)) {
        this.server.to(this.userRoom(participant.userId)).emit('message_receipts_updated', event);
      }
    }
  }

  private toReceipt(receipt: MessageReceipt) {
    return {
      messageId: receipt.messageId,
      userId: receipt.userId,
      deliveredAt: receipt.deliveredAt?.toISOString() ?? null,
      readAt: receipt.readAt?.toISOString() ?? null,
    };
  }

  private async canAccessConversation(userId: string, conversationId: string) {
    const participants = await this.participants.find({
      where: { conversationId },
      select: { userId: true },
    });
    if (!participants.some(participant => participant.userId === userId)) return false;

    const otherUserId = participants.find(participant => participant.userId !== userId)?.userId;
    if (!otherUserId) return false;

    const otherUser = await this.users.findOne({
      where: { id: otherUserId },
      select: { id: true, isPrivate: true },
    });
    if (!otherUser) return false;
    if (!otherUser.isPrivate || userId === otherUserId) return true;

    return this.follows.exists({
      where: { followerId: userId, followingId: otherUserId },
    });
  }

  private userRoom(userId: string) {
    return `user:${userId}`;
  }
}
