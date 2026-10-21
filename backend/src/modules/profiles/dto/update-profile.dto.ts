import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { RelationshipGoal } from 'src/shared/entity/enum';

export class UpdateLifestyleDto {
  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsString()
  education?: string;
}

export class UpdateProfileDto {
  @IsOptional() @IsString() fullName?: string;
  @IsOptional() @IsString() bio?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() pronouns?: string;
  @IsOptional() @IsEnum(RelationshipGoal) relationshipGoal?: RelationshipGoal;
  @IsOptional()
  @IsArray()
  @IsUrl({ protocols: ['http', 'https'], require_tld: false }, { each: true })
  photos?: string[];

  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'], require_tld: false })
  avatar?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) interests?: string[];
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateLifestyleDto)
  lifestyle?: UpdateLifestyleDto;
}
