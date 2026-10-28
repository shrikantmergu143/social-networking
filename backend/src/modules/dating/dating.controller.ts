import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DatingService } from './dating.service';
import { DatingActionDto } from './dto/dating-action.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('dating')
@UseGuards(JwtAuthGuard)
@ApiTags('Dating')
@ApiBearerAuth('JWT-auth')
export class DatingController {
  constructor(private readonly dating: DatingService) {}

  @Get('discover')
  @ApiOperation({ summary: 'Get dating profiles to discover' })
  @ApiResponse({
    status: 200,
    description: 'Profiles matching the authenticated user preferences.',
    schema: {
      example: [
        {
          id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
          username: 'jordan-3c4d5e',
          fullName: 'Jordan Lee',
          age: 29,
          gender: 'woman',
          location: 'Portland, OR',
          distanceKm: 8,
          photos: [],
          interests: ['hiking', 'music'],
          isVerified: true,
          isOnline: true,
        },
      ],
    },
  })
  discover(@Req() request: any) {
    return this.dating.discover(request.user.id);
  }

  @Post('actions')
  @ApiOperation({ summary: 'Like or pass on a dating profile' })
  @ApiResponse({
    status: 201,
    description: 'Recorded action and match status.',
    schema: {
      example: {
        action: 'like',
        matched: true,
        matchId: '8b84ea76-d11b-46c7-bbcc-92f3400d7dc5',
      },
    },
  })
  act(@Req() request: any, @Body() body: DatingActionDto) {
    return this.dating.act(request.user.id, body.profileId, body.action);
  }

  @Get('matches')
  @ApiOperation({ summary: 'List dating matches' })
  @ApiResponse({
    status: 200,
    description: 'Profiles for the authenticated user matches.',
    schema: {
      example: [
        {
          id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
          username: 'jordan-3c4d5e',
          fullName: 'Jordan Lee',
          age: 29,
          isVerified: true,
          isOnline: false,
        },
      ],
    },
  })
  matches(@Req() request: any) {
    return this.dating.matches(request.user.id);
  }
}
