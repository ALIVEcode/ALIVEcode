import { IsNotEmpty, IsEmpty, IsEnum } from 'class-validator';
import { CreatedByUser } from '../../../../generics/entities/createdByUser.entity';
import { UserEntity } from '../../../user/entities/user.entity';
import { IOTPROJECT_ACCESS, IOTPROJECT_INTERACT_RIGHTS } from '../entities/IoTproject.entity';

export class IoTProjectUpdateDTO extends CreatedByUser {
  @IsEmpty()
  creator: UserEntity;

  @IsNotEmpty()
  @IsEnum(IOTPROJECT_ACCESS)
  access: IOTPROJECT_ACCESS;

  @IsNotEmpty()
  @IsEnum(IOTPROJECT_INTERACT_RIGHTS)
  interactRights: IOTPROJECT_INTERACT_RIGHTS;
}