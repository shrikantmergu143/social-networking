import { Module } from '@nestjs/common';
import { PreferencesController } from './preferences.controller';
import { PreferencesService } from './preferences.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDatingPreferences } from '../users/entities/user-dating-preferences.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserDatingPreferences])],
  controllers: [PreferencesController],
  providers: [PreferencesService]
})
export class PreferencesModule {}
