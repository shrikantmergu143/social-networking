import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UserDatingPreferences } from './entities/user-dating-preferences.entity';
import { UserLifestyle } from './entities/user-lifestyle.entity';
import { UserPhoto } from './entities/user-photo.entity';
import { UserInterest } from './entities/user-interest.entity';
import { UserSocialLink } from './entities/user-social-link.entity';
import { UserFollow } from './entities/user-follow.entity';

// import { UsersService } from './users.service';
// import { UsersController } from './users.controller';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserDatingPreferences,
      UserLifestyle,
      UserPhoto,
      UserInterest,
      UserSocialLink,
      UserFollow,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
