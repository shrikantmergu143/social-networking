import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsString,
  MaxLength,
} from 'class-validator';
import { PostVisibility } from '../../../shared/entity/enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpsertPostDto {
  @ApiProperty({ example: 'A sunny afternoon by the coast.', maxLength: 5000 })
  @IsString()
  @MaxLength(5000)
  caption!: string;

  @ApiProperty({ type: [String], example: ['https://cdn.example.com/photo.jpg'], maxItems: 6 })
  @IsArray()
  @ArrayMaxSize(6)
  @IsString({ each: true })
  @MaxLength(2048, { each: true })
  images!: string[];

  @ApiProperty({ type: [String], example: ['weekend', 'coast'], maxItems: 10 })
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  tags!: string[];

  @ApiProperty({ enum: PostVisibility, example: PostVisibility.PUBLIC })
  @IsEnum(PostVisibility)
  visibility!: PostVisibility;
}

export class SetPostLikeDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  isLiked!: boolean;
}

export class SetPostSaveDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  isSaved!: boolean;
}
