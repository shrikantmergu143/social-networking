import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  BaseEntity,
  Index,
} from 'typeorm';
import { UserDatingPreferences } from './user-dating-preferences.entity';
import { UserLifestyle } from './user-lifestyle.entity';
import { UserPhoto } from './user-photo.entity';
import { UserInterest } from './user-interest.entity';
import { UserSocialLink } from './user-social-link.entity';
import { Gender, RelationshipGoal } from 'src/shared/entity/enum';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ name: 'username', type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ name: 'full_name', type: 'varchar', length: 150 })
  fullName: string;

  @Index({ unique: true })
  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  phoneNumber: string | null;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
    select: false,
  })
  passwordHash: string;

  @Column({ name: 'birth_name', type: 'date', nullable: true })
  birthDate?: string | null;

  @Column({ name: 'gender', type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ name: 'pronouns', type: 'varchar', length: 50, nullable: true })
  pronouns: string | null;

  @Column({ name: 'location', type: 'varchar', length: 255, nullable: true })
  location: string | null;
  @Column({ name: 'latitude', type: 'double precision', nullable: true })
  latitude: number | null;
  @Column({ name: 'longitude', type: 'double precision', nullable: true })
  longitude: number | null;
  @Column({ name: 'bio', type: 'text', default: '' })
  bio: string;
  @Column({ name: 'avatar', type: 'text', nullable: true })
  avatar: string | null;
  @Column({ name: 'cover_image', type: 'text', nullable: true })
  coverImage: string | null;
  @Column({
    name: 'relationship_goal',
    type: 'enum',
    enum: RelationshipGoal,
    nullable: true,
  })
  relationshipGoal: RelationshipGoal;

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ name: 'is_private', type: 'boolean', default: false })
  isPrivate: boolean;

  @Column({ name: 'is_online', type: 'boolean', default: false })
  isOnline: boolean;

  @Column({
    name: 'last_active',
    type: 'timestamptz',
    nullable: true,
  })
  lastActive: Date | null;

  @OneToOne(() => UserDatingPreferences, (preferences) => preferences.user)
  datingPreferences: UserDatingPreferences;

  @OneToOne(() => UserLifestyle, (lifestyle) => lifestyle.user)
  lifestyle: UserLifestyle;

  @OneToMany(() => UserPhoto, (photo) => photo.user)
  photos: UserPhoto[];

  @OneToMany(() => UserInterest, (interest) => interest.user)
  interests: UserInterest[];

  @OneToMany(() => UserSocialLink, (link) => link.user)
  socialLinks: UserSocialLink[];
}
