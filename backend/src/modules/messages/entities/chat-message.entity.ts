import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { MessageStatus } from 'src/shared/entity/enum';
import { Conversation } from 'src/modules/conversations/entities/conversation.entity';
import { MessageReceipt } from './message-receipt.entity';

@Entity('chat_messages')
@Index('idx_chat_messages_conversation_created', [
  'conversationId',
  'createdAt',
])
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'conversation_id', type: 'uuid' })
  conversationId: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @Column({ name: 'sender_id', type: 'uuid' })
  senderId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column({ name: 'text', type: 'text', default: '' })
  text: string;

  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl: string | null;

  @Column({
    name: 'status',
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.SENT,
  })
  status: MessageStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => MessageReceipt, (receipt) => receipt.message)
  receipts: MessageReceipt[];
}
