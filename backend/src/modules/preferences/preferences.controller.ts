import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PreferencesService } from './preferences.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Controller('preferences')
@UseGuards(JwtAuthGuard)
export class PreferencesController {
  constructor(private readonly preferences: PreferencesService) {}

  @Get()
  get(@Req() request: any) {
    return this.preferences.get(request.user.id);
  }

  @Patch()
  update(@Req() request: any, @Body() body: UpdatePreferencesDto) {
    return this.preferences.update(request.user.id, body);
  }
}
