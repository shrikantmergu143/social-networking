import { Module } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { ConversationParticipant } from './entities/conversation-participant.entity';
import { ChatMessage } from '../messages/entities/chat-message.entity';
import { User } from '../users/entities/user.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { UserFollow } from '../users/entities/user-follow.entity';
import { MessageReceipt } from '../messages/entities/message-receipt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, ConversationParticipant, ChatMessage, MessageReceipt, User, UserFollow]), NotificationsModule],
  controllers: [ConversationsController],
  providers: [ConversationsService]
})
export class ConversationsModule {}
