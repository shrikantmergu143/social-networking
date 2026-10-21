import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UserSettings } from './entities/user-settings.entity';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserSettings, User])],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
