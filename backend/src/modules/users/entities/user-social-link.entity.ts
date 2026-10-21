import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

import { User } from './user.entity';

@Entity('user_social_links')
@Unique('uq_user_social_platform', ['userId', 'platform'])
export class UserSocialLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'platform', type: 'varchar', length: 30 })
  platform: string;

  @Column({ name: 'profile_url', type: 'text' })
  profileUrl: string;
}
