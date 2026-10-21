import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional() @IsBoolean() isProfileVisible?: boolean;
  @IsOptional() @IsBoolean() incognitoMode?: boolean;
  @IsOptional() @IsBoolean() showOnlineStatus?: boolean;
  @IsOptional() @IsBoolean() showDistance?: boolean;
  @IsOptional() @IsBoolean() showAge?: boolean;
  @IsOptional() @IsBoolean() pushNotifications?: boolean;
  @IsOptional() @IsBoolean() emailNotifications?: boolean;
  @IsOptional() @IsBoolean() matchAlerts?: boolean;
  @IsOptional() @IsBoolean() messageAlerts?: boolean;
  @IsOptional() @IsIn(['light', 'dark', 'system']) theme?: 'light' | 'dark' | 'system';
}

export class UpdateCredentialsDto {
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() phone?: string;
}

export class VerificationDto {
  @IsIn(['photo', 'social']) method: 'photo' | 'social';
}
