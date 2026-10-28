import { IsEnum, IsInt, IsOptional, IsString, IsUrl, Max, MaxLength, Min } from 'class-validator';
import { StoryMediaType } from '../../../shared/entity/enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStoryDto {
  @ApiProperty({ example: 'https://cdn.example.com/story.jpg' })
  @IsUrl({ protocols: ['http', 'https'], require_tld: false })
  mediaUrl!: string;

  @ApiProperty({ enum: StoryMediaType, example: StoryMediaType.IMAGE })
  @IsEnum(StoryMediaType)
  mediaType!: StoryMediaType;

  @ApiPropertyOptional({ example: 'Weekend views', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  caption?: string;

  @ApiPropertyOptional({ example: 5, minimum: 1, maximum: 30 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  durationSeconds?: number;
}
