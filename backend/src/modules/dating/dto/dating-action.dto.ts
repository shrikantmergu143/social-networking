import { IsEnum, IsUUID } from 'class-validator';
import { DatingActionType } from '../../../shared/entity/enum';

export class DatingActionDto {
  @IsUUID()
  profileId!: string;

  @IsEnum(DatingActionType)
  action!: DatingActionType;
}
