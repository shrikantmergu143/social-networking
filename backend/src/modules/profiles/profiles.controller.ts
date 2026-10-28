import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequestUser } from '../auth/interfaces/authenticated-request-user.interface';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

interface ProfileRequest extends Request {
  user: AuthenticatedRequestUser;
}

@Controller('profiles')
@UseGuards(JwtAuthGuard)
@ApiTags('Profiles')
@ApiBearerAuth('JWT-auth')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Patch('me')
  @ApiOperation({ summary: 'Update the authenticated user profile' })
  @ApiResponse({
    status: 200,
    description:
      'Updated user profile entity, including lifestyle, photos, and interests relations.',
    schema: {
      type: 'object',
      example: {
        id: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1',
        fullName: 'Avery Johnson',
        bio: 'Coffee, coastal walks, and live music.',
        location: 'Portland, OR',
        avatar: 'https://cdn.example.com/avatar.jpg',
        photos: [
          { photoUrl: 'https://cdn.example.com/photo.jpg', displayOrder: 0 },
        ],
        interests: [{ interest: 'hiking' }],
        lifestyle: {
          occupation: 'Product designer',
          education: 'Bachelor of Arts',
        },
      },
    },
  })
  updateMe(@Req() request: ProfileRequest, @Body() dto: UpdateProfileDto) {
    return this.profilesService.update(request.user.id, dto);
  }
}
