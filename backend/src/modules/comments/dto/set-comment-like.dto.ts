import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetCommentLikeDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  isLiked!: boolean;
}
