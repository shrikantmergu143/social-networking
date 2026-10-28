import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConversationsService } from './conversations.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
@ApiTags('Conversations')
@ApiBearerAuth('JWT-auth')
export class ConversationsController {
  constructor(private readonly conversations: ConversationsService) {}

  @Get()
  @ApiOperation({ summary: 'List the authenticated user conversations' })
  @ApiResponse({
    status: 200,
    description: 'Conversation summaries, newest activity first.',
    schema: {
      example: [
        {
          id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
          participant: {
            id: '8b84ea76-d11b-46c7-bbcc-92f3400d7dc5',
            username: 'jordan-3c4d5e',
            fullName: 'Jordan Lee',
            avatar: '',
          },
          lastMessage: {
            id: 'b6f80f10-961a-4518-bb24-c9258cfbc6d8',
            text: 'Hi there!',
            status: 'sent',
          },
          unreadCount: 1,
          updatedAt: '2026-10-28T12:00:00.000Z',
        },
      ],
    },
  })
  list(@Req() request: any) {
    return this.conversations.list(request.user.id);
  }

  @Post(':userId')
  @ApiOperation({ summary: 'Open or create a conversation with a user' })
  @ApiResponse({
    status: 201,
    description: 'The conversation ID.',
    schema: { example: { id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1' } },
  })
  open(
    @Req() request: any,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return this.conversations.open(request.user.id, userId);
  }
}
