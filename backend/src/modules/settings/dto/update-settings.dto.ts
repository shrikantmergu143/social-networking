import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSettingsDto {
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isProfileVisible?: boolean;
  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  incognitoMode?: boolean;
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  showOnlineStatus?: boolean;
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  showDistance?: boolean;
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  showAge?: boolean;
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  pushNotifications?: boolean;
  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  matchAlerts?: boolean;
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  messageAlerts?: boolean;
  @ApiPropertyOptional({ enum: ['light', 'dark', 'system'], example: 'system' })
  @IsOptional()
  @IsIn(['light', 'dark', 'system'])
  theme?: 'light' | 'dark' | 'system';
}

export class UpdateCredentialsDto {
  @ApiPropertyOptional({ example: 'avery@example.com' })
  @IsOptional()
  @IsString()
  email?: string;
  @ApiPropertyOptional({ example: '+1-555-0100' })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class VerificationDto {
  @ApiProperty({ enum: ['photo', 'social'], example: 'photo' })
  @IsIn(['photo', 'social'])
  method: 'photo' | 'social';
}
