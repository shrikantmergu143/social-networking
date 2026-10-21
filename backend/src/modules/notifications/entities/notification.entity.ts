import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { NotificationTargetType, NotificationType } from 'src/shared/entity/enum';

@Entity('notifications')
@Index('idx_notifications_user_created', ['userId', 'createdAt'])
export class AppNotification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'actor_id', type: 'uuid', nullable: true })
  actorId: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'actor_id' })
  actor: User | null;

  @Column({
    name: 'type',
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({ name: 'text', type: 'text' })
  text: string;

  @Column({ name: 'target_id', type: 'uuid', nullable: true })
  targetId: string | null;

  @Column({
    name: 'target_type',
    type: 'enum',
    enum: NotificationTargetType,
    nullable: true,
  })
  targetType: NotificationTargetType | null;

  @Column({ name: 'is_read', type: 'boolean', default: false })
  isRead: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}