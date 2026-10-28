import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiTags('Messages')
@ApiBearerAuth('JWT-auth')
export class MessagesController {
  constructor(private readonly messages: MessagesService) {}

  @Get(':conversationId')
  @ApiOperation({ summary: 'List messages in a conversation' })
  @ApiResponse({
    status: 200,
    description: 'Messages ordered from oldest to newest.',
    schema: {
      example: [
        {
          id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
          conversationId: '8b84ea76-d11b-46c7-bbcc-92f3400d7dc5',
          senderId: 'b6f80f10-961a-4518-bb24-c9258cfbc6d8',
          text: 'Hi there!',
          timestamp: '2026-10-28T12:00:00.000Z',
          status: 'delivered',
          receipts: [
            {
              messageId: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
              userId: 'b6f80f10-961a-4518-bb24-c9258cfbc6d8',
              deliveredAt: '2026-10-28T12:00:01.000Z',
              readAt: null,
            },
          ],
        },
      ],
    },
  })
  list(
    @Req() request: any,
    @Param('conversationId', new ParseUUIDPipe()) conversationId: string,
  ) {
    return this.messages.list(request.user.id, conversationId);
  }

  @Patch(':conversationId/read')
  @ApiOperation({ summary: 'Mark conversation messages as read' })
  @ApiResponse({
    status: 200,
    description: 'Read marker for the conversation.',
    schema: {
      example: {
        conversationId: '8b84ea76-d11b-46c7-bbcc-92f3400d7dc5',
        readerId: 'b6f80f10-961a-4518-bb24-c9258cfbc6d8',
        readAt: '2026-10-28T12:05:00.000Z',
      },
    },
  })
  markRead(
    @Req() request: any,
    @Param('conversationId', new ParseUUIDPipe()) conversationId: string,
  ) {
    return this.messages.markRead(request.user.id, conversationId);
  }

  @Post(':conversationId')
  @ApiOperation({ summary: 'Send a message to a conversation' })
  @ApiResponse({
    status: 201,
    description: 'The created message and delivery receipts.',
    schema: {
      example: {
        id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
        conversationId: '8b84ea76-d11b-46c7-bbcc-92f3400d7dc5',
        senderId: 'b6f80f10-961a-4518-bb24-c9258cfbc6d8',
        text: 'Hi there!',
        timestamp: '2026-10-28T12:00:00.000Z',
        status: 'sent',
        receipts: [],
      },
    },
  })
  send(
    @Req() request: any,
    @Param('conversationId', new ParseUUIDPipe()) conversationId: string,
    @Body() body: SendMessageDto,
  ) {
    return this.messages.send(request.user.id, conversationId, body);
  }
}
