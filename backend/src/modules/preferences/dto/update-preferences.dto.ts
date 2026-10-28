import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { Gender, RelationshipGoal } from '../../../shared/entity/enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePreferencesDto {
  @ApiPropertyOptional({ enum: Gender, isArray: true, example: [Gender.WOMAN] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(4)
  @IsEnum(Gender, { each: true })
  genderPreference?: Gender[];

  @ApiPropertyOptional({
    type: [Number],
    example: [25, 40],
    minItems: 2,
    maxItems: 2,
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsInt({ each: true })
  @Min(18, { each: true })
  @Max(99, { each: true })
  ageRange?: number[];

  @ApiPropertyOptional({ example: 80, minimum: 1, maximum: 500 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(500)
  maxDistanceKm?: number;

  @ApiPropertyOptional({
    enum: RelationshipGoal,
    isArray: true,
    example: [RelationshipGoal.LONG_TERM_PARTNER],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(6)
  @IsEnum(RelationshipGoal, { each: true })
  intentions?: RelationshipGoal[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  verifiedOnly?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  recentlyActiveOnly?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  onlineOnly?: boolean;
}
