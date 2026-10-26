import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { PostVisibility } from '../../shared/entity/enum';
import { Post } from './entities/post.entity';
import { PostImage } from './entities/post-image.entity';
import { PostTag } from './entities/post-tag.entity';
import { PostLike } from './entities/post-like.entity';
import { PostSave } from './entities/post-save.entity';
import { PostComment } from './entities/post-comment.entity';
import { User } from '../users/entities/user.entity';
import { UpsertPostDto } from './dto/post.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationTargetType, NotificationType } from '../../shared/entity/enum';
import { UserFollow } from '../users/entities/user-follow.entity';

export interface FeedComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userVerified: boolean;
  text: string;
  createdAt: string;
  likesCount: number;
  parentCommentId?: string;
  replies: FeedComment[];
}

@Injectable()
export class PostsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Post)
    private readonly posts: Repository<Post>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly notifications: NotificationsService,
  ) {}

  async getFeed(userId: string) {
    const followRows = await this.dataSource.getRepository(UserFollow).find({
      where: { followerId: userId },
      select: { followingId: true },
    });
    const followedIds = followRows.map(follow => follow.followingId);
    const posts = await this.posts.find({
      where: [
        { visibility: PostVisibility.PUBLIC },
        { userId },
        ...(followedIds.length ? [{ userId: In(followedIds) }] : []),
      ],
      relations: {
        user: true,
        images: true,
        tags: true,
        comments: { user: true, likes: true, replies: { user: true, likes: true } },
        likes: true,
        saves: true,
      },
      order: { createdAt: 'DESC' },
    });
    return posts
      .filter?.(post => !post.user.isPrivate || post.userId === userId || followedIds.includes(post.userId))
      .map(post => this.toFeedPost(post, userId));
  }

  async getOwnPosts(userId: string) {
    const posts = await this.posts.find({
      where: { userId },
      relations: {
        user: true,
        images: true,
        tags: true,
        comments: { user: true, likes: true, replies: { user: true, likes: true } },
        likes: true,
        saves: true,
      },
      order: { createdAt: 'DESC' },
    });
    return posts.map(post => this.toFeedPost(post, userId));
  }

  async create(userId: string, dto: UpsertPostDto) {
    const user = await this.users.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found.');

    const postId = await this.dataSource.transaction(async (manager) => {
      const postRepository = manager.getRepository(Post);
      const post = await postRepository.save(
        postRepository.create({
          userId,
          caption: dto.caption.trim(),
          visibility: dto.visibility,
        }),
      );
      await this.replaceMediaAndTags(manager, post.id, dto);
      return post.id;
    });

    return this.findPostForUser(postId, userId);
  }

  async update(postId: string, userId: string, dto: UpsertPostDto) {
    const post = await this.posts.findOneBy({ id: postId });
    this.assertOwner(post, userId);

    await this.dataSource.transaction(async (manager) => {
      const postRepository = manager.getRepository(Post);
      await postRepository.update(postId, {
        caption: dto.caption.trim(),
        visibility: dto.visibility,
      });
      await this.replaceMediaAndTags(manager, postId, dto);
    });

    return this.findPostForUser(postId, userId);
  }

  async remove(postId: string, userId: string) {
    const post = await this.posts.findOneBy({ id: postId });
    this.assertOwner(post, userId);
    await this.posts.delete({ id: postId });
    return { deleted: true };
  }

  async setLike(postId: string, userId: string, isLiked: boolean) {
    await this.assertPostExists(postId);
    const likes = this.dataSource.getRepository(PostLike);
    const existing = await likes.findOneBy({ postId, userId });
    if (isLiked && !existing) {
      await likes.save(likes.create({ postId, userId }));
      const post = await this.posts.findOneBy({ id: postId });
      if (post) {
        await this.notifications.create({
          userId: post.userId,
          actorId: userId,
          type: NotificationType.LIKE,
          text: 'liked your post',
          targetId: postId,
          targetType: NotificationTargetType.POST,
        });
      }
    }
    if (!isLiked && existing) await likes.delete({ id: existing.id });

    return {
      isLiked,
      likesCount: await likes.countBy({ postId }),
    };
  }

  async setSave(postId: string, userId: string, isSaved: boolean) {
    await this.assertPostExists(postId);
    const saves = this.dataSource.getRepository(PostSave);
    const existing = await saves.findOneBy({ postId, userId });
    if (isSaved && !existing) await saves.save(saves.create({ postId, userId }));
    if (!isSaved && existing) await saves.delete({ id: existing.id });
    return { isSaved };
  }

  private async replaceMediaAndTags(
    manager: EntityManager,
    postId: string,
    dto: UpsertPostDto,
  ) {
    const images = manager.getRepository(PostImage);
    const tags = manager.getRepository(PostTag);
    await images.delete({ postId });
    await tags.delete({ postId });

    if (dto.images.length) {
      await images.save(
        dto.images.map((imageUrl, displayOrder) =>
          images.create({ postId, imageUrl, displayOrder }),
        ),
      );
    }
    const uniqueTags = [...new Set(dto.tags.map((tag) => tag.trim()).filter?.(Boolean))];
    if (uniqueTags.length) {
      await tags.save(uniqueTags.map((tag) => tags.create({ postId, tag })));
    }
  }

  private async assertPostExists(postId: string) {
    const post = await this.posts.findOneBy({ id: postId });
    if (!post) throw new NotFoundException('Post not found.');
  }

  private assertOwner(post: Post | null, userId: string): asserts post is Post {
    if (!post) throw new NotFoundException('Post not found.');
    if (post.userId !== userId) throw new ForbiddenException('You cannot modify this post.');
  }

  private async findPostForUser(postId: string, userId: string) {
    const post = await this.posts.findOne({
      where: { id: postId },
      relations: {
        user: true,
        images: true,
        tags: true,
        comments: { user: true, likes: true, replies: { user: true, likes: true } },
        likes: true,
        saves: true,
      },
    });
    if (!post) throw new NotFoundException('Post not found.');
    return this.toFeedPost(post, userId);
  }

  private toFeedPost(post: Post, userId: string) {
    const mapComment = (comment: PostComment): FeedComment => ({
      id: comment.id,
      postId: comment.postId,
      userId: comment.userId,
      userName: comment.user?.fullName ?? 'Unknown user',
      userAvatar: comment.user?.avatar ?? '',
      userVerified: comment.user?.isVerified ?? false,
      text: comment.text,
      createdAt: comment.createdAt.toISOString(),
      likesCount: comment.likes?.length ?? 0,
      parentCommentId: comment.parentCommentId ?? undefined,
      replies: (comment.replies ?? []).map(mapComment),
    });

    return {
      id: post.id,
      userId: post.userId,
      author: {
        id: post.user.id,
        name: post.user.fullName,
        username: post.user.username,
        avatar: post.user.avatar ?? '',
        isVerified: post.user.isVerified,
        location: post.user.location ?? undefined,
      },
      caption: post.caption,
      images: [...(post.images ?? [])]
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((image) => image.imageUrl),
      likesCount: post.likes?.length ?? 0,
      commentsCount: this.countComments(
        (post.comments ?? []).filter?.((comment) => !comment.parentCommentId),
      ),
      sharesCount: 0,
      createdAt: post.createdAt.toISOString(),
      isLiked: post.likes?.some((like) => like.userId === userId) ?? false,
      isSaved: post.saves?.some((save) => save.userId === userId) ?? false,
      tags: (post.tags ?? []).map((tag) => tag.tag),
      visibility: post.visibility,
      comments: (post.comments ?? [])
        .filter?.((comment) => !comment.parentCommentId)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map(mapComment),
    };
  }

  private countComments(comments: PostComment[]): number {
    return comments.reduce(
      (count, comment) => count + 1 + this.countComments(comment.replies ?? []),
      0,
    );
  }
}
