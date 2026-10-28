import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  IsNumber,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { RelationshipGoal } from 'src/shared/entity/enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLifestyleDto {
  @ApiPropertyOptional({ example: 'Product designer' })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiPropertyOptional({ example: 'Bachelor of Arts' })
  @IsOptional()
  @IsString()
  education?: string;
}

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Avery Johnson' })
  @IsOptional()
  @IsString()
  fullName?: string;
  @ApiPropertyOptional({ example: 'Coffee, coastal walks, and live music.' })
  @IsOptional()
  @IsString()
  bio?: string;
  @ApiPropertyOptional({ example: 'Portland, OR' })
  @IsOptional()
  @IsString()
  location?: string;
  @ApiPropertyOptional({ example: 45.5152, minimum: -90, maximum: 90 })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;
  @ApiPropertyOptional({ example: -122.6784, minimum: -180, maximum: 180 })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;
  @ApiPropertyOptional({ example: 'https://cdn.example.com/cover.jpg' })
  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'], require_tld: false })
  coverImage?: string;
  @ApiPropertyOptional({ example: 'they/them' })
  @IsOptional()
  @IsString()
  pronouns?: string;
  @ApiPropertyOptional({
    enum: RelationshipGoal,
    example: RelationshipGoal.LONG_TERM_PARTNER,
  })
  @IsOptional()
  @IsEnum(RelationshipGoal)
  relationshipGoal?: RelationshipGoal;
  @ApiPropertyOptional({
    type: [String],
    example: ['https://cdn.example.com/photo.jpg'],
  })
  @IsOptional()
  @IsArray()
  @IsUrl({ protocols: ['http', 'https'], require_tld: false }, { each: true })
  photos?: string[];

  @ApiPropertyOptional({ example: 'https://cdn.example.com/avatar.jpg' })
  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'], require_tld: false })
  avatar?: string;
  @ApiPropertyOptional({ type: [String], example: ['hiking', 'music'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];
  @ApiPropertyOptional({ type: () => UpdateLifestyleDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateLifestyleDto)
  lifestyle?: UpdateLifestyleDto;
}
