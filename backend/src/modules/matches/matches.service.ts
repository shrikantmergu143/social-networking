import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatingMatch } from '../dating/entities/dating-match.entity';

@Injectable()
export class MatchesService {
  constructor(@InjectRepository(DatingMatch) private readonly matches: Repository<DatingMatch>) {}

  async remove(userId: string, otherUserId: string) {
    const match = await this.matches.findOne({
      where: [
        { userOneId: userId, userTwoId: otherUserId, isActive: true },
        { userOneId: otherUserId, userTwoId: userId, isActive: true },
      ],
    });
    if (!match) throw new NotFoundException('Match not found.');
    match.isActive = false;
    await this.matches.save(match);
    return { removed: true };
  }
}
