import { Controller, Get, Param, ParseUUIDPipe, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  list(@Req() request: any) {
    return this.notifications.list(request.user.id);
  }

  @Patch('read-all')
  readAll(@Req() request: any) {
    return this.notifications.readAll(request.user.id);
  }

  @Patch(':notificationId/read')
  read(@Req() request: any, @Param('notificationId', new ParseUUIDPipe()) notificationId: string) {
    return this.notifications.read(request.user.id, notificationId);
  }
}
