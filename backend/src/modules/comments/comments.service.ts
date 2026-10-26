import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../posts/entities/post.entity';
import { PostComment } from '../posts/entities/post-comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationTargetType, NotificationType } from '../../shared/entity/enum';
import { PostCommentLike } from '../posts/entities/post-comment-like.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Post)
    private readonly posts: Repository<Post>,
    @InjectRepository(PostComment)
    private readonly comments: Repository<PostComment>,
    @InjectRepository(PostCommentLike)
    private readonly likes: Repository<PostCommentLike>,
    private readonly notifications: NotificationsService,
  ) {}

  async create(userId: string, dto: CreateCommentDto) {
    if (!dto.text.trim()) throw new BadRequestException('Comment text is required.');

    const post = await this.posts.findOneBy({ id: dto.postId });
    if (!post) throw new NotFoundException('Post not found.');

    if (dto.parentCommentId) {
      const parent = await this.comments.findOneBy({
        id: dto.parentCommentId,
        postId: dto.postId,
      });
      if (!parent) throw new NotFoundException('Parent comment not found.');
    }

    const saved = await this.comments.save(
      this.comments.create({
        postId: dto.postId,
        userId,
        text: dto.text.trim(),
        parentCommentId: dto.parentCommentId ?? null,
      }),
    );
    await this.notifications.create({
      userId: post.userId,
      actorId: userId,
      type: NotificationType.COMMENT,
      text: 'commented on your post',
      targetId: dto.postId,
      targetType: NotificationTargetType.POST,
    });
    const comment = await this.comments.findOne({
      where: { id: saved.id },
      relations: { user: true },
    });
    if (!comment) throw new NotFoundException('Comment could not be loaded.');

    return {
      id: comment.id,
      postId: comment.postId,
      userId: comment.userId,
      userName: comment.user.fullName,
      userAvatar: comment.user.avatar ?? '',
      userVerified: comment.user.isVerified,
      text: comment.text,
      createdAt: comment.createdAt.toISOString(),
      likesCount: 0,
      parentCommentId: comment.parentCommentId ?? undefined,
    };
  }

  async setLike(userId: string, commentId: string, isLiked: boolean) {
    const comment = await this.comments.findOneBy({ id: commentId });
    if (!comment) throw new NotFoundException('Comment not found.');
    const existing = await this.likes.findOneBy({ commentId, userId });
    if (isLiked && !existing) await this.likes.save(this.likes.create({ commentId, userId }));
    if (!isLiked && existing) await this.likes.delete({ id: existing.id });
    return {
      isLiked,
      likesCount: await this.likes.countBy({ commentId }),
    };
  }
}
