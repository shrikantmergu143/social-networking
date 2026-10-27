import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messages: MessagesService) {}

  @Get(':conversationId')
  list(@Req() request: any, @Param('conversationId', new ParseUUIDPipe()) conversationId: string) {
    return this.messages.list(request.user.id, conversationId);
  }

  @Patch(':conversationId/read')
  markRead(@Req() request: any, @Param('conversationId', new ParseUUIDPipe()) conversationId: string) {
    return this.messages.markRead(request.user.id, conversationId);
  }

  @Post(':conversationId')
  send(@Req() request: any, @Param('conversationId', new ParseUUIDPipe()) conversationId: string, @Body() body: SendMessageDto) {
    return this.messages.send(request.user.id, conversationId, body);
  }
}
