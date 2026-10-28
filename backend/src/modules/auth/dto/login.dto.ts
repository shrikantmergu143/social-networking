import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'avery@example.com' })
  @IsEmail()
  @MaxLength(254)
  email: string;

  @ApiProperty({ example: 'Example!Pass123', minLength: 1, maxLength: 72 })
  @IsString()
  @MinLength(1)
  @MaxLength(72)
  password: string;
}
