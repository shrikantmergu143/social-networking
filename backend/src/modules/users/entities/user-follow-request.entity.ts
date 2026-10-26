import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_follow_requests')
@Unique('uq_user_follow_request', ['requesterId', 'targetId'])
@Check('chk_user_follow_request_not_self', '"requester_id" <> "target_id"')
export class UserFollowRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'requester_id', type: 'uuid' })
  requesterId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  @Column({ name: 'target_id', type: 'uuid' })
  targetId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'target_id' })
  target: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
