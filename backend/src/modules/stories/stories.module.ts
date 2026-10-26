import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Story } from './entities/story.entity';
import { StoryItem } from './entities/story-item.entity';
import { StoryView } from './entities/story-view.entity';
import { User } from '../users/entities/user.entity';

import { StoriesService } from './stories.service';
import { StoriesController } from './stories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Story, StoryItem, StoryView, User])],
  controllers: [StoriesController],
  providers: [StoriesService],
  exports: [StoriesService, TypeOrmModule],
})
export class StoriesModule {}
