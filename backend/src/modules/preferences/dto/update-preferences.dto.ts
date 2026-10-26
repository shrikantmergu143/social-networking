import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Gender, RelationshipGoal } from '../../../shared/entity/enum';

export class UpdatePreferencesDto {
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(4)
  @IsEnum(Gender, { each: true })
  genderPreference?: Gender[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsInt({ each: true })
  @Min(18, { each: true })
  @Max(99, { each: true })
  ageRange?: number[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(500)
  maxDistanceKm?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(6)
  @IsEnum(RelationshipGoal, { each: true })
  intentions?: RelationshipGoal[];

  @IsOptional()
  @IsBoolean()
  verifiedOnly?: boolean;

  @IsOptional()
  @IsBoolean()
  recentlyActiveOnly?: boolean;

  @IsOptional()
  @IsBoolean()
  onlineOnly?: boolean;
}
