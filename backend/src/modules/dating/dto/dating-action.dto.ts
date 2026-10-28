import { IsEnum, IsUUID } from 'class-validator';
import { DatingActionType } from '../../../shared/entity/enum';
import { ApiProperty } from '@nestjs/swagger';

export class DatingActionDto {
  @ApiProperty({ format: 'uuid', example: '2a1a1f2c-4c7a-4b2e-8e99-74d73041d7a1' })
  @IsUUID()
  profileId!: string;

  @ApiProperty({ enum: DatingActionType, example: DatingActionType.LIKE })
  @IsEnum(DatingActionType)
  action!: DatingActionType;
}
