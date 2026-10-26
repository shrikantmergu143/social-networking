import { IsEnum, IsInt, IsOptional, IsString, IsUrl, Max, MaxLength, Min } from 'class-validator';
import { StoryMediaType } from '../../../shared/entity/enum';

export class CreateStoryDto {
  @IsUrl({ protocols: ['http', 'https'], require_tld: false })
  mediaUrl!: string;

  @IsEnum(StoryMediaType)
  mediaType!: StoryMediaType;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  caption?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  durationSeconds?: number;
}
