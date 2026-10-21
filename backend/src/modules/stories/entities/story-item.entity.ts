import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { Story } from './story.entity';
import { StoryMediaType } from 'src/shared/entity/enum';

@Entity('story_items')
export class StoryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'story_id', type: 'uuid' })
  storyId: string;

  @ManyToOne(() => Story, (story) => story.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'story_id' })
  story: Story;

  @Column({ name: 'media_url', type: 'text' })
  mediaUrl: string;

  @Column({
    name: 'media_type',
    type: 'enum',
    enum: StoryMediaType,
  })
  mediaType: StoryMediaType;

  @Column({ name: 'duration_seconds', type: 'smallint', default: 5 })
  durationSeconds: number;

  @Column({ name: 'caption', type: 'text', nullable: true })
  caption: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
