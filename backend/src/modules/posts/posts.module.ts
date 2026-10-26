import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Post } from './entities/post.entity';
import { PostImage } from './entities/post-image.entity';
import { PostTag } from './entities/post-tag.entity';
import { PostComment } from './entities/post-comment.entity';
import { PostLike } from './entities/post-like.entity';
import { PostSave } from './entities/post-save.entity';
import { PostCommentLike } from './entities/post-comment-like.entity';
import { User } from '../users/entities/user.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { UserFollow } from '../users/entities/user-follow.entity';

import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      PostImage,
      PostTag,
      PostComment,
      PostLike,
      PostSave,
      PostCommentLike,
      User,
      UserFollow,
    ]),
    NotificationsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService, TypeOrmModule],
})
export class PostsModule {}
