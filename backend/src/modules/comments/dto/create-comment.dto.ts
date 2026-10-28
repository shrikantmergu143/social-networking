import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ format: 'uuid', example: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1' })
  @IsUUID()
  postId!: string;

  @ApiProperty({ example: 'This is such a great photo!', maxLength: 5000 })
  @IsString()
  @MaxLength(5000)
  text!: string;

  @ApiPropertyOptional({ format: 'uuid', example: '8b84ea76-d11b-46c7-bbcc-92f3400d7dc5' })
  @IsOptional()
  @IsUUID()
  parentCommentId?: string;
}
