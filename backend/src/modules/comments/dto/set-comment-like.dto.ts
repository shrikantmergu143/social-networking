import { IsBoolean } from 'class-validator';

export class SetCommentLikeDto {
  @IsBoolean()
  isLiked!: boolean;
}
