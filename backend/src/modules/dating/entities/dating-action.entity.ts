import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
  Unique,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { DatingActionType } from 'src/shared/entity/enum';

@Entity('dating_actions')
@Unique('uq_dating_action_actor_target', ['actorId', 'profileId'])
@Index('idx_dating_actions_target', ['profileId'])
export class DatingActionRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'actor_id', type: 'uuid' })
  actorId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'actor_id' })
  actor: User;

  @Column({ name: 'profile_id', type: 'uuid' })
  profileId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile: User;

  @Column({
    name: 'action',
    type: 'enum',
    enum: DatingActionType,
  })
  action: DatingActionType;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
