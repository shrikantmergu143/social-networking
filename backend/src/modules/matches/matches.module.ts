import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatingMatch } from '../dating/entities/dating-match.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DatingMatch])],
  controllers: [MatchesController],
  providers: [MatchesService]
})
export class MatchesModule {}
