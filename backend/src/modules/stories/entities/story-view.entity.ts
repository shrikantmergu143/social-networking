import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Story } from './story.entity';
import { StoryItem } from './story-item.entity';

@Entity('story_views')
@Unique('uq_story_viewer_item', ['storyItemId', 'userId'])
export class StoryView {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'story_id', type: 'uuid' })
  storyId: string;

  @ManyToOne(() => Story, (story) => story.views, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'story_id' })
  story: Story;

  @Column({ name: 'story_item_id', type: 'uuid' })
  storyItemId: string;

  @ManyToOne(() => StoryItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'story_item_id' })
  storyItem: StoryItem;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'viewed_at', type: 'timestamptz' })
  viewedAt: Date;
}
