import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsString,
  MaxLength,
} from 'class-validator';
import { PostVisibility } from '../../../shared/entity/enum';

export class UpsertPostDto {
  @IsString()
  @MaxLength(5000)
  caption!: string;

  @IsArray()
  @ArrayMaxSize(6)
  @IsString({ each: true })
  @MaxLength(2048, { each: true })
  images!: string[];

  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  tags!: string[];

  @IsEnum(PostVisibility)
  visibility!: PostVisibility;
}

export class SetPostLikeDto {
  @IsBoolean()
  isLiked!: boolean;
}

export class SetPostSaveDto {
  @IsBoolean()
  isSaved!: boolean;
}
