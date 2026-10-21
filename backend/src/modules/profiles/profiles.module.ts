import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UserInterest } from '../users/entities/user-interest.entity';
import { UserLifestyle } from '../users/entities/user-lifestyle.entity';
import { UserPhoto } from '../users/entities/user-photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserInterest, UserLifestyle, UserPhoto])],
  providers: [ProfilesService],
  controllers: [ProfilesController],
})
export class ProfilesModule {}
