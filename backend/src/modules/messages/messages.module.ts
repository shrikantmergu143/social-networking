import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatMessage } from './entities/chat-message.entity';

import { Conversation } from '../conversations/entities/conversation.entity';
import { ConversationParticipant } from '../conversations/entities/conversation-participant.entity';

import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { User } from '../users/entities/user.entity';
import { UserFollow } from '../users/entities/user-follow.entity';
import { AuthModule } from '../auth/auth.module';
import { ChatGateway } from './chat.gateway';
import { MessageReceipt } from './entities/message-receipt.entity';

@Module({
  imports: [
    AuthModule,
    NotificationsModule,
    TypeOrmModule.forFeature([
      Conversation,
      ConversationParticipant,
      ChatMessage,
      MessageReceipt,
      User,
      UserFollow,
    ]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, ChatGateway],
  exports: [TypeOrmModule],
})
export class MessagesModule {}
