import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../posts/entities/post.entity';
import { PostComment } from '../posts/entities/post-comment.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { PostCommentLike } from '../posts/entities/post-comment-like.entity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostComment, PostCommentLike]), NotificationsModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
