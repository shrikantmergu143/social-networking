import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class SendMessageDto {
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  text?: string;

  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'], require_tld: false })
  imageUrl?: string;
}
