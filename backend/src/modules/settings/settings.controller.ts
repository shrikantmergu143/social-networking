/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  UpdateCredentialsDto,
  UpdateSettingsDto,
  VerificationDto,
} from './dto/update-settings.dto';
import { SettingsService } from './settings.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller()
@UseGuards(JwtAuthGuard)
@ApiTags('Settings and account')
@ApiBearerAuth('JWT-auth')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get('settings')
  @ApiOperation({ summary: 'Get account and notification settings' })
  @ApiResponse({
    status: 200,
    description: 'Current settings and account contact verification state.',
    schema: {
      example: {
        isProfileVisible: true,
        isPrivate: false,
        incognitoMode: false,
        showOnlineStatus: true,
        pushNotifications: true,
        theme: 'light',
        credentials: {
          email: 'avery@example.com',
          phone: '+1-555-0100',
          emailVerified: true,
          phoneVerified: false,
        },
      },
    },
  })
  getSettings(@Req() request: any) {
    return this.service.get(request.user.id);
  }

  @Patch('settings')
  @ApiOperation({ summary: 'Update account and notification settings' })
  @ApiResponse({
    status: 200,
    description:
      'Updated settings and account contact state; response shape matches GET /api/settings.',
    schema: {
      example: {
        isProfileVisible: true,
        isPrivate: true,
        incognitoMode: false,
        showOnlineStatus: true,
        pushNotifications: true,
        theme: 'system',
        credentials: {
          email: 'avery@example.com',
          phone: '+1-555-0100',
          emailVerified: true,
          phoneVerified: false,
        },
      },
    },
  })
  updateSettings(@Req() request: any, @Body() dto: UpdateSettingsDto) {
    return this.service.update(request.user.id, dto);
  }

  @Patch('account/credentials')
  @ApiOperation({ summary: 'Update account contact credentials' })
  @ApiResponse({
    status: 200,
    description: 'Updated contact information and verification flags.',
    schema: {
      example: {
        email: 'avery@example.com',
        phone: '+1-555-0100',
        emailVerified: false,
        phoneVerified: false,
      },
    },
  })
  updateCredentials(@Req() request: any, @Body() dto: UpdateCredentialsDto) {
    return this.service.updateCredentials(request.user.id, dto);
  }

  @Post('account/verification')
  @ApiOperation({ summary: 'Start account verification' })
  @ApiResponse({
    status: 201,
    description: 'Verification state.',
    schema: { example: { isVerified: true } },
  })
  verify(@Req() request: any, @Body() _dto: VerificationDto) {
    return this.service.verify(request.user.id);
  }
}
