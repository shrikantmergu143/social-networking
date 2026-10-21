import { User } from 'src/modules/users/entities/user.entity';
import { Gender, RelationshipGoal } from 'src/shared/entity/enum';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user_dating_preferences')
export class UserDatingPreferences {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.datingPreferences, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId: string;

  @Column({
    name: 'gender_preferences',
    type: 'enum',
    enum: Gender,
    array: true,
    default: [],
  })
  genderPreferences: Gender[];
  @Column({ name: 'min_age', type: 'smallint', default: 18 })
  minAge: number;
  @Column({ name: 'max_age', type: 'smallint', default: 18 })
  maxAge: number;

  @Column({
    name: 'max_distance_km',
    type: 'numeric',
    precision: 8,
    scale: 2,
    default: 50,
  })
  maxDistanceKm: number;
  @Column({
    name: 'intensions',
    type: 'enum',
    enum: RelationshipGoal,
    array: true,
    default: [],
  })
  intentions: RelationshipGoal[];
  @Column({ name: 'verified_only', type: 'boolean', default: false })
  verifiedOnly: boolean;
  @Column({
    name: 'recently_active_only',
    type: 'boolean',
    default: false,
  })
  recentlyActiveOnly: boolean;
  @Column({ name: 'online_only', type: 'boolean', default: false })
  onlineOnly: boolean;
}
