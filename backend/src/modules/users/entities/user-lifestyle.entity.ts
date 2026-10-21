import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { User } from './user.entity';
import { Drinking, Exercise, Smoking } from 'src/shared/entity/enum';

@Entity('user_lifestyles')
export class UserLifestyle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.lifestyle, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId: string;

  @Column({
    name: 'drinking',
    type: 'enum',
    enum: Drinking,
    nullable: true,
  })
  drinking: Drinking | null;

  @Column({
    name: 'smoking',
    type: 'enum',
    enum: Smoking,
    nullable: true,
  })
  smoking: Smoking | null;

  @Column({
    name: 'exercise',
    type: 'enum',
    enum: Exercise,
    nullable: true,
  })
  exercise: Exercise | null;

  @Column({ name: 'pets', type: 'varchar', length: 100, nullable: true })
  pets: string | null;

  @Column({ name: 'zodiac', type: 'varchar', length: 50, nullable: true })
  zodiac: string | null;

  @Column({ name: 'education', type: 'varchar', length: 150, nullable: true })
  education: string | null;

  @Column({ name: 'occupation', type: 'varchar', length: 150, nullable: true })
  occupation: string | null;

  @Column({
    name: 'languages',
    type: 'varchar',
    length: 100,
    array: true,
    default: [],
  })
  languages: string[];
}
