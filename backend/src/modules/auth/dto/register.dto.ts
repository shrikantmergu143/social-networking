import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Gender } from 'src/shared/entity/enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class PasswordsMatchConstraint implements ValidatorConstraintInterface {
  validate(confirmPassword: unknown, args: ValidationArguments): boolean {
    const dto = args.object as RegisterDto;
    return (
      typeof confirmPassword == 'string' && confirmPassword === dto.password
    );
  }
  defaultMessage(): string {
    return 'confirmPassword must match password';
  }
}

@ValidatorConstraint({ name: 'adultBirthDate', async: false })
class AdultBirthDateConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== 'string') return false;
    const birth = new Date(`${value}T00:00:00.000Z`);
    if (Number.isNaN(birth.getTime())) return false;

    const today = new Date();
    let age = today.getUTCFullYear() - birth.getUTCFullYear();
    const monthDiff = today.getUTCMonth() - birth.getUTCMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getUTCDate() < birth.getUTCDate())
    ) {
      age--;
    }
    return age >= 18 && birth <= today;
  }

  defaultMessage(): string {
    return 'You must be at least 18 years old';
  }
}

export class RegisterDto {
  @ApiProperty({ example: 'Avery Johnson', minLength: 2, maxLength: 150 })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  fullName: string;

  @ApiProperty({ example: 'avery@example.com' })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiPropertyOptional({ example: '+1-555-0100', maxLength: 30 })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phoneNumber?: string;

  @ApiProperty({ example: '1995-06-15', format: 'date', description: 'Must be 18 or older' })
  @IsDateString({ strict: true })
  @Validate(AdultBirthDateConstraint)
  birthDate: string;

  @ApiProperty({ enum: Gender, example: Gender.WOMAN })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: 'Example!Pass123', minLength: 12, maxLength: 72, description: 'Must include uppercase, lowercase, number, and special character' })
  @IsString()
  @MinLength(12)
  @MaxLength(72, {
    message: 'Password must be at most 72 characters for bcrypt',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, {
    message:
      'Password must contain uppercase, lowercase, number, and special character',
  })
  password: string;

  @ApiProperty({ example: 'Example!Pass123' })
  @IsString()
  @Validate(PasswordsMatchConstraint)
  confirmPassword: string;
}
