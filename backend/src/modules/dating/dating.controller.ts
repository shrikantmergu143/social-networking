import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DatingService } from './dating.service';
import { DatingActionDto } from './dto/dating-action.dto';

@Controller('dating')
@UseGuards(JwtAuthGuard)
export class DatingController {
  constructor(private readonly dating: DatingService) {}

  @Get('discover')
  discover(@Req() request: any) {
    return this.dating.discover(request.user.id);
  }

  @Post('actions')
  act(@Req() request: any, @Body() body: DatingActionDto) {
    return this.dating.act(request.user.id, body.profileId, body.action);
  }

  @Get('matches')
  matches(@Req() request: any) {
    return this.dating.matches(request.user.id);
  }
}
