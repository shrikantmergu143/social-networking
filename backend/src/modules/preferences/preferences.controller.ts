import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PreferencesService } from './preferences.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('preferences')
@UseGuards(JwtAuthGuard)
@ApiTags('Preferences')
@ApiBearerAuth('JWT-auth')
export class PreferencesController {
  constructor(private readonly preferences: PreferencesService) {}

  @Get()
  @ApiOperation({ summary: 'Get discovery and dating preferences' })
  @ApiResponse({
    status: 200,
    description:
      'Current preference values, including defaults for unset fields.',
    schema: {
      example: {
        genderPreference: ['woman'],
        ageRange: [25, 40],
        maxDistanceKm: 80,
        intentions: ['Long-term partner'],
        verifiedOnly: false,
        recentlyActiveOnly: false,
        onlineOnly: false,
      },
    },
  })
  get(@Req() request: any) {
    return this.preferences.get(request.user.id);
  }

  @Patch()
  @ApiOperation({ summary: 'Update discovery and dating preferences' })
  @ApiResponse({
    status: 200,
    description:
      'Updated preferences in the same shape as GET /api/preferences.',
    schema: {
      example: {
        genderPreference: ['woman'],
        ageRange: [25, 40],
        maxDistanceKm: 80,
        intentions: ['Long-term partner'],
        verifiedOnly: false,
        recentlyActiveOnly: false,
        onlineOnly: false,
      },
    },
  })
  update(@Req() request: any, @Body() body: UpdatePreferencesDto) {
    return this.preferences.update(request.user.id, body);
  }
}
