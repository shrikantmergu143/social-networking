import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UserDatingPreferences } from './entities/user-dating-preferences.entity';
import { UserLifestyle } from './entities/user-lifestyle.entity';
import { UserPhoto } from './entities/user-photo.entity';
import { UserInterest } from './entities/user-interest.entity';
import { UserSocialLink } from './entities/user-social-link.entity';
import { UserFollow } from './entities/user-follow.entity';
import { UserBlock } from './entities/user-block.entity';
import { SavedProfile } from './entities/saved-profile.entity';
import { UserReport } from './entities/user-report.entity';
import { UserFollowRequest } from './entities/user-follow-request.entity';
import { NotificationsModule } from '../notifications/notifications.module';

// import { UsersService } from './users.service';
// import { UsersController } from './users.controller';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    NotificationsModule,
    TypeOrmModule.forFeature([
      User,
      UserDatingPreferences,
      UserLifestyle,
      UserPhoto,
      UserInterest,
      UserSocialLink,
      UserFollow,
      UserBlock,
      SavedProfile,
      UserReport,
      UserFollowRequest,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
