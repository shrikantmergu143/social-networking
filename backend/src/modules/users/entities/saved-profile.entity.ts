import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from 'typeorm';
import { User } from './user.entity';

@Entity('saved_profiles')
@Unique('uq_saved_profile', ['userId', 'profileId'])
export class SavedProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'profile_id', type: 'uuid' })
  profileId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
