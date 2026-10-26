import { Controller, Delete, Param, ParseUUIDPipe, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MatchesService } from './matches.service';

@Controller('matches')
@UseGuards(JwtAuthGuard)
export class MatchesController {
  constructor(private readonly matches: MatchesService) {}

  @Delete(':userId')
  remove(@Req() request: any, @Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.matches.remove(request.user.id, userId);
  }
}
