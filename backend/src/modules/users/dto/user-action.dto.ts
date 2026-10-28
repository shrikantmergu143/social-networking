import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReportUserDto {
  @ApiProperty({ example: 'Impersonation', minLength: 3, maxLength: 200 })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  reason!: string;

  @ApiProperty({
    example: "This account is using someone else's photos.",
    maxLength: 2000,
  })
  @IsString()
  @MaxLength(2000)
  details!: string;
}
