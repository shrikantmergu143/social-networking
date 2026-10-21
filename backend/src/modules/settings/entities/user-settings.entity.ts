import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_settings')
export class UserSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId: string;

  @Column({ type: 'jsonb', default: {} })
  settings: Record<string, unknown>;
}
