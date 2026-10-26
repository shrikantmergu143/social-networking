import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsUUID()
  postId!: string;

  @IsString()
  @MaxLength(5000)
  text!: string;

  @IsOptional()
  @IsUUID()
  parentCommentId?: string;
}
