import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Delete,
  Query,
  Req,
  UseGuards,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { ReportUserDto } from './dto/user-action.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiTags('Users and social graph')
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search users by name' })
  @ApiQuery({ name: 'q', required: false, example: 'Avery' })
  @ApiResponse({
    status: 200,
    description: 'Matching public profiles.',
    schema: {
      example: [
        {
          id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
          username: 'avery-1a2b3c',
          fullName: 'Avery Johnson',
          age: 31,
          gender: 'woman',
          location: 'Portland, OR',
          avatar: '',
          photos: [],
          interests: ['hiking'],
          isVerified: false,
          isPrivate: false,
          isFollowing: false,
          hasPendingFollowRequest: false,
          isOnline: true,
          followerCount: 12,
          followingCount: 8,
          postCount: 4,
        },
      ],
    },
  })
  search(@Req() request: any, @Query('q') query = '') {
    return this.users.search(request.user.id, query);
  }

  @Get('me/following')
  @ApiOperation({ summary: 'List users followed by the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Profiles followed by the authenticated user.',
    schema: {
      example: [
        {
          id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
          username: 'jordan-3c4d5e',
          fullName: 'Jordan Lee',
          age: 29,
          gender: 'woman',
          isFollowing: true,
          isPrivate: false,
          followerCount: 22,
          followingCount: 16,
          postCount: 7,
        },
      ],
    },
  })
  following(@Req() request: any) {
    return this.users.following(request.user.id);
  }

  @Get('me/followers')
  @ApiOperation({ summary: 'List the authenticated user followers' })
  @ApiResponse({
    status: 200,
    description: 'Profiles following the authenticated user.',
    schema: {
      example: [
        {
          id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
          username: 'jordan-3c4d5e',
          fullName: 'Jordan Lee',
          age: 29,
          gender: 'woman',
          isFollowing: false,
          isPrivate: false,
          followerCount: 22,
          followingCount: 16,
          postCount: 7,
        },
      ],
    },
  })
  followers(@Req() request: any) {
    return this.users.followers(request.user.id);
  }

  @Get('me/saved')
  @ApiOperation({ summary: 'List saved profiles' })
  @ApiResponse({
    status: 200,
    description: 'Profiles saved by the authenticated user.',
    schema: {
      example: [
        {
          id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
          username: 'jordan-3c4d5e',
          fullName: 'Jordan Lee',
          age: 29,
          gender: 'woman',
          isPrivate: false,
          isFollowing: false,
          followerCount: 22,
          followingCount: 16,
          postCount: 7,
        },
      ],
    },
  })
  saved(@Req() request: any) {
    return this.users.savedProfiles(request.user.id);
  }

  @Get('me/blocked')
  @ApiOperation({ summary: 'List blocked profiles' })
  @ApiResponse({
    status: 200,
    description: 'Profiles blocked by the authenticated user.',
    schema: {
      example: [
        {
          id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
          username: 'jordan-3c4d5e',
          fullName: 'Jordan Lee',
          age: 29,
          gender: 'woman',
          isPrivate: false,
          isFollowing: false,
          followerCount: 22,
          followingCount: 16,
          postCount: 7,
        },
      ],
    },
  })
  blocked(@Req() request: any) {
    return this.users.blockedProfiles(request.user.id);
  }

  @Post(':userId/follow')
  @ApiOperation({ summary: 'Follow a user or send a follow request' })
  @ApiResponse({
    status: 201,
    description:
      'Follow state; private profiles return requestPending=true until approval.',
    schema: { example: { isFollowing: true, requestPending: false } },
  })
  follow(
    @Req() request: any,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return this.users.setFollow(request.user.id, userId, true);
  }

  @Delete(':userId/follow')
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiResponse({
    status: 200,
    description: 'Updated follow state.',
    schema: { example: { isFollowing: false, requestPending: false } },
  })
  unfollow(
    @Req() request: any,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return this.users.setFollow(request.user.id, userId, false);
  }

  @Get('me/follow-requests')
  @ApiOperation({ summary: 'List incoming follow requests' })
  @ApiResponse({
    status: 200,
    description: 'Profiles that requested to follow the authenticated user.',
    schema: {
      example: [
        {
          id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
          username: 'jordan-3c4d5e',
          fullName: 'Jordan Lee',
          age: 29,
          isPrivate: false,
          hasPendingFollowRequest: false,
        },
      ],
    },
  })
  followRequests(@Req() request: any) {
    return this.users.followRequests(request.user.id);
  }

  @Post(':userId/follow-request/accept')
  @ApiOperation({ summary: 'Accept a follow request' })
  @ApiResponse({
    status: 201,
    description: 'Follow request decision.',
    schema: { example: { accepted: true } },
  })
  acceptFollowRequest(
    @Req() request: any,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return this.users.respondToFollowRequest(request.user.id, userId, true);
  }

  @Delete(':userId/follow-request')
  @ApiOperation({ summary: 'Cancel an outgoing follow request' })
  @ApiResponse({
    status: 200,
    description: 'Outgoing request state.',
    schema: { example: { requestPending: false } },
  })
  cancelFollowRequest(
    @Req() request: any,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return this.users.cancelFollowRequest(request.user.id, userId);
  }

  @Delete(':userId/follow-request/decline')
  @ApiOperation({ summary: 'Decline an incoming follow request' })
  @ApiResponse({
    status: 200,
    description: 'Follow request decision.',
    schema: { example: { accepted: false } },
  })
  declineFollowRequest(
    @Req() request: any,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return this.users.respondToFollowRequest(request.user.id, userId, false);
  }

  @Delete(':userId/follower')
  @ApiOperation({ summary: 'Remove a follower' })
  @ApiResponse({
    status: 200,
    description: 'Follower removed.',
    schema: { example: { removed: true } },
  })
  removeFollower(
    @Req() request: any,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return this.users.removeFollower(request.user.id, userId);
  }

  @Post(':userId/save')
  @ApiOperation({ summary: 'Save a user profile' })
  @ApiResponse({
    status: 201,
    description: 'Updated saved-profile state.',
    schema: { example: { isSaved: true } },
  })
  saveProfile(
    @Req() request: any,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return this.users.setSavedProfile(request.user.id, userId, true);
  }

  @Delete(':userId/save')
  @ApiOperation({ summary: 'Remove a saved profile' })
  @ApiResponse({
    status: 200,
    description: 'Updated saved-profile state.',
    schema: { example: { isSaved: false } },
  })
  unsaveProfile(
    @Req() request: any,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return this.users.setSavedProfile(request.user.id, userId, false);
  }

  @Post(':userId/block')
  @ApiOperation({ summary: 'Block a user' })
  @ApiResponse({
    status: 201,
    description: 'Blocked state.',
    schema: { example: { blocked: true } },
  })
  block(
    @Req() request: any,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return this.users.block(request.user.id, userId);
  }

  @Delete(':userId/block')
  @ApiOperation({ summary: 'Unblock a user' })
  @ApiResponse({
    status: 200,
    description: 'Blocked state.',
    schema: { example: { blocked: false } },
  })
  unblock(
    @Req() request: any,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return this.users.unblock(request.user.id, userId);
  }

  @Post(':userId/report')
  @ApiOperation({ summary: 'Report a user' })
  @ApiResponse({
    status: 201,
    description: 'Created moderation report.',
    schema: {
      example: {
        id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
        status: 'pending',
      },
    },
  })
  report(
    @Req() request: any,
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() dto: ReportUserDto,
  ) {
    return this.users.report(request.user.id, userId, dto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get a user profile' })
  @ApiResponse({
    status: 200,
    description: 'The requested public profile.',
    schema: {
      example: {
        id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
        username: 'jordan-3c4d5e',
        fullName: 'Jordan Lee',
        age: 29,
        gender: 'woman',
        location: 'Portland, OR',
        distanceKm: 8,
        bio: 'Coffee and weekend hikes.',
        avatar: '',
        photos: [],
        interests: ['hiking'],
        relationshipGoal: 'Long-term partner',
        lifestyle: {},
        isVerified: false,
        isPrivate: false,
        isFollowing: false,
        hasPendingFollowRequest: false,
        isOnline: true,
        followerCount: 22,
        followingCount: 16,
        postCount: 7,
      },
    },
  })
  getProfile(
    @Req() request: any,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return this.users.getProfile(userId, request.user.id);
  }
}
