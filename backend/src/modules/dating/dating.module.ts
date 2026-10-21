import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatingActionRecord } from './entities/dating-action.entity';
import { DatingMatch } from './entities/dating-match.entity';

import { DatingController } from './dating.controller';
import { DatingService } from './dating.service';

@Module({
  imports: [TypeOrmModule.forFeature([DatingActionRecord, DatingMatch])],
  controllers: [DatingController],
  providers: [DatingService],
  exports: [DatingService, TypeOrmModule],
})
export class DatingModule {}
