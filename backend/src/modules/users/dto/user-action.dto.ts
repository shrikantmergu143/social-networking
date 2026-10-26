import { IsString, MaxLength, MinLength } from 'class-validator';

export class ReportUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  reason!: string;

  @IsString()
  @MaxLength(2000)
  details!: string;
}
