import { IsNotEmpty, IsEmpty } from 'class-validator';
import { CreatedByUser } from '../../../../generics/entities/createdByUser.entity';
import { UserEntity } from '../../../user/entities/user.entity';
import { IOTPROJECT_ACCESS, IOTPROJECT_INTERACT_RIGHTS } from '../entities/IoTproject.entity';

export class IoTProjectUpdateDTO extends CreatedByUser {
  @IsEmpty()
  creator: UserEntity;

  @IsNotEmpty()
  access: IOTPROJECT_ACCESS;

  @IsNotEmpty()
  interactRights: IOTPROJECT_INTERACT_RIGHTS;
}