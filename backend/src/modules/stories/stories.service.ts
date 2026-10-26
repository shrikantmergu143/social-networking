import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Story } from './entities/story.entity';
import { StoryItem } from './entities/story-item.entity';
import { StoryView } from './entities/story-view.entity';
import { StoryMediaType } from '../../shared/entity/enum';

@Injectable()
export class StoriesService {
  constructor(
    @InjectRepository(Story) private readonly stories: Repository<Story>,
    @InjectRepository(StoryItem) private readonly items: Repository<StoryItem>,
    @InjectRepository(StoryView) private readonly views: Repository<StoryView>,
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async list(viewerId: string) {
    const stories = await this.stories.find({
      relations: { user: true, items: true, views: true },
      order: { createdAt: 'DESC' },
    });
    return stories.filter?.(story => story.items.some(item =>
      Date.now() - item.createdAt.getTime() < 24 * 60 * 60 * 1000
    )).map(story => ({
      id: story.id,
      userId: story.userId,
      userName: story.user.fullName,
      userAvatar: story.user.avatar ?? '',
      isVerified: story.user.isVerified,
      hasUnseenStories: story.items.some(item =>
        !story.views.some(view => view.storyItemId === item.id && view.userId === viewerId)
      ),
      stories: story.items
        .filter?.(item => Date.now() - item.createdAt.getTime() < 24 * 60 * 60 * 1000)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map(item => ({
          id: item.id,
          mediaUrl: item.mediaUrl,
          mediaType: item.mediaType,
          durationSeconds: item.durationSeconds,
          caption: item.caption ?? undefined,
          timestamp: item.createdAt.toISOString(),
          viewed: story.views.some(view => view.storyItemId === item.id && view.userId === viewerId),
        })),
    }));
  }

  async create(userId: string, body: { mediaUrl: string; mediaType: 'image' | 'video'; caption?: string; durationSeconds?: number }) {
    if (!body.mediaUrl?.trim()) throw new BadRequestException('Story media is required.');
    const user = await this.users.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found.');
    let story = await this.stories.findOne({ where: { userId }, order: { createdAt: 'DESC' } });
    if (!story || Date.now() - story.createdAt.getTime() > 24 * 60 * 60 * 1000) {
      story = await this.stories.save(this.stories.create({ userId }));
    }
    const item = await this.items.save(this.items.create({
      storyId: story.id,
      mediaUrl: body.mediaUrl,
      mediaType: body.mediaType as StoryMediaType,
      caption: body.caption?.trim() || null,
      durationSeconds: Math.min(Math.max(body.durationSeconds ?? 5, 1), 30),
    }));
    return { id: item.id, storyId: story.id, mediaUrl: item.mediaUrl, mediaType: item.mediaType, durationSeconds: item.durationSeconds, caption: item.caption, timestamp: item.createdAt.toISOString() };
  }

  async view(userId: string, itemId: string) {
    const item = await this.items.findOneBy({ id: itemId });
    if (!item) throw new NotFoundException('Story not found.');
    const existing = await this.views.findOneBy({ storyItemId: itemId, userId });
    if (!existing) await this.views.save(this.views.create({ storyId: item.storyId, storyItemId: itemId, userId }));
    return { viewed: true };
  }
}
