import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'List notifications for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'The latest notifications for the authenticated user.',
    schema: {
      example: [
        {
          id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
          type: 'like',
          actor: {
            id: '8b84ea76-d11b-46c7-bbcc-92f3400d7dc5',
            name: 'Jordan Lee',
            avatar: '',
            username: 'jordan-3c4d5e',
          },
          text: 'liked your post',
          targetId: 'b6f80f10-961a-4518-bb24-c9258cfbc6d8',
          targetType: 'post',
          createdAt: '2026-10-28T12:00:00.000Z',
          isRead: false,
        },
      ],
    },
  })
  list(@Req() request: any) {
    return this.notifications.list(request.user.id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({
    status: 200,
    description: 'All unread notifications were marked read.',
    schema: { example: { updated: true } },
  })
  readAll(@Req() request: any) {
    return this.notifications.readAll(request.user.id);
  }

  @Patch(':notificationId/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiResponse({
    status: 200,
    description: 'Updated notification read state.',
    schema: { example: { isRead: true } },
  })
  read(
    @Req() request: any,
    @Param('notificationId', new ParseUUIDPipe()) notificationId: string,
  ) {
    return this.notifications.read(request.user.id, notificationId);
  }
}
