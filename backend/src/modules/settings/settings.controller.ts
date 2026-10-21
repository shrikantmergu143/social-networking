import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateCredentialsDto, UpdateSettingsDto, VerificationDto } from './dto/update-settings.dto';
import { SettingsService } from './settings.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get('settings') getSettings(@Req() request: any) { return this.service.get(request.user.id); }
  @Patch('settings') updateSettings(@Req() request: any, @Body() dto: UpdateSettingsDto) { return this.service.update(request.user.id, dto); }
  @Patch('account/credentials') updateCredentials(@Req() request: any, @Body() dto: UpdateCredentialsDto) { return this.service.updateCredentials(request.user.id, dto); }
  @Post('account/verification') verify(@Req() request: any, @Body() _dto: VerificationDto) { return this.service.verify(request.user.id); }
}
