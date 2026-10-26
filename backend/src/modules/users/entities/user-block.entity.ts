import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from 'typeorm';
import { User } from './user.entity';

@Entity('user_blocks')
@Unique('uq_user_block', ['userId', 'blockedUserId'])
export class UserBlock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'blocked_user_id', type: 'uuid' })
  blockedUserId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blocked_user_id' })
  blockedUser: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
