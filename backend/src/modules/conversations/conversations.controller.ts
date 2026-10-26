import { Controller, Get, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConversationsService } from './conversations.service';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private readonly conversations: ConversationsService) {}

  @Get()
  list(@Req() request: any) {
    return this.conversations.list(request.user.id);
  }

  @Post(':userId')
  open(@Req() request: any, @Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.conversations.open(request.user.id, userId);
  }
}
