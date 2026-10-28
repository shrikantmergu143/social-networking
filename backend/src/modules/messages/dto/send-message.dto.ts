import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiPropertyOptional({ example: 'Hey, how has your week been?', maxLength: 5000 })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  text?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/message.jpg', description: 'Optional image attachment URL' })
  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'], require_tld: false })
  imageUrl?: string;
}
