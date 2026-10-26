import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatingActionRecord } from './entities/dating-action.entity';
import { DatingMatch } from './entities/dating-match.entity';
import { User } from '../users/entities/user.entity';
import { UserDatingPreferences } from '../users/entities/user-dating-preferences.entity';
import { UserPhoto } from '../users/entities/user-photo.entity';
import { UserInterest } from '../users/entities/user-interest.entity';
import { UserLifestyle } from '../users/entities/user-lifestyle.entity';
import { UserFollow } from '../users/entities/user-follow.entity';
import { UserFollowRequest } from '../users/entities/user-follow-request.entity';
import { NotificationsModule } from '../notifications/notifications.module';

import { DatingController } from './dating.controller';
import { DatingService } from './dating.service';

@Module({
  imports: [TypeOrmModule.forFeature([DatingActionRecord, DatingMatch, User, UserDatingPreferences, UserPhoto, UserInterest, UserLifestyle, UserFollow, UserFollowRequest]), NotificationsModule],
  controllers: [DatingController],
  providers: [DatingService],
  exports: [DatingService, TypeOrmModule],
})
export class DatingModule {}
