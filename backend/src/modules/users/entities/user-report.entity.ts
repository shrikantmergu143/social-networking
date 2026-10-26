import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_reports')
export class UserReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'reporter_id', type: 'uuid' })
  reporterId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reporter_id' })
  reporter: User;

  @Column({ name: 'reported_user_id', type: 'uuid' })
  reportedUserId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reported_user_id' })
  reportedUser: User;

  @Column({ name: 'reason', type: 'varchar', length: 200 })
  reason: string;

  @Column({ name: 'details', type: 'text', default: '' })
  details: string;

  @Column({ name: 'status', type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
