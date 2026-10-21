import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
  Check,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity('dating_matches')
@Unique('uq_dating_match_pair', ['userOneId', 'userTwoId'])
@Check('chk_dating_match_different_users', '"user_one_id" <> "user_two_id"')
export class DatingMatch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_one_id', type: 'uuid' })
  userOneId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_one_id' })
  userOne: User;

  @Column({ name: 'user_two_id', type: 'uuid' })
  userTwoId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_two_id' })
  userTwo: User;

  @Column({ name: 'matched_at', type: 'timestamptz' })
  matchedAt: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
