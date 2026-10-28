import {
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MatchesService } from './matches.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('matches')
@UseGuards(JwtAuthGuard)
@ApiTags('Matches')
@ApiBearerAuth('JWT-auth')
export class MatchesController {
  constructor(private readonly matches: MatchesService) {}

  @Delete(':userId')
  @ApiOperation({ summary: 'Remove a match with a user' })
  @ApiResponse({
    status: 200,
    description: 'Match removed.',
    schema: { example: { removed: true } },
  })
  remove(
    @Req() request: any,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return this.matches.remove(request.user.id, userId);
  }
}
