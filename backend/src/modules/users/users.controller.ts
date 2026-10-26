import {
  Controller, Get, Param, ParseUUIDPipe, Post, Delete, Query, Req, UseGuards,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { ReportUserDto } from './dto/user-action.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('search')
  search(@Req() request: any, @Query('q') query = '') {
    return this.users.search(request.user.id, query);
  }

  @Get('me/following')
  following(@Req() request: any) {
    return this.users.following(request.user.id);
  }

  @Get('me/followers')
  followers(@Req() request: any) {
    return this.users.followers(request.user.id);
  }

  @Get('me/saved')
  saved(@Req() request: any) {
    return this.users.savedProfiles(request.user.id);
  }

  @Get('me/blocked')
  blocked(@Req() request: any) {
    return this.users.blockedProfiles(request.user.id);
  }

  @Post(':userId/follow')
  follow(@Req() request: any, @Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.users.setFollow(request.user.id, userId, true);
  }

  @Delete(':userId/follow')
  unfollow(@Req() request: any, @Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.users.setFollow(request.user.id, userId, false);
  }

  @Get('me/follow-requests')
  followRequests(@Req() request: any) {
    return this.users.followRequests(request.user.id);
  }

  @Post(':userId/follow-request/accept')
  acceptFollowRequest(@Req() request: any, @Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.users.respondToFollowRequest(request.user.id, userId, true);
  }

  @Delete(':userId/follow-request')
  cancelFollowRequest(@Req() request: any, @Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.users.cancelFollowRequest(request.user.id, userId);
  }

  @Delete(':userId/follow-request/decline')
  declineFollowRequest(@Req() request: any, @Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.users.respondToFollowRequest(request.user.id, userId, false);
  }

  @Delete(':userId/follower')
  removeFollower(@Req() request: any, @Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.users.removeFollower(request.user.id, userId);
  }

  @Post(':userId/save')
  saveProfile(@Req() request: any, @Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.users.setSavedProfile(request.user.id, userId, true);
  }

  @Delete(':userId/save')
  unsaveProfile(@Req() request: any, @Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.users.setSavedProfile(request.user.id, userId, false);
  }

  @Post(':userId/block')
  block(@Req() request: any, @Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.users.block(request.user.id, userId);
  }

  @Delete(':userId/block')
  unblock(@Req() request: any, @Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.users.unblock(request.user.id, userId);
  }

  @Post(':userId/report')
  report(
    @Req() request: any,
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() dto: ReportUserDto,
  ) {
    return this.users.report(request.user.id, userId, dto);
  }

  @Get(':userId')
  getProfile(@Req() request: any, @Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.users.getProfile(userId, request.user.id);
  }
}
