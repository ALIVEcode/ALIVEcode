import { IsEmpty } from 'class-validator';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { CreatedByUser } from '../../../../generics/entities/createdByUser.entity';
import { UserEntity } from '../../../user/entities/user.entity';
import { IoTProjectEntity } from '../../IoTproject/entities/IoTproject.entity';
import { IoTProjectObjectEntity } from '../../IoTproject/entities/IoTprojectObject.entity';

@Entity()
export class IoTObjectEntity extends CreatedByUser {
  @ManyToOne(() => UserEntity, user => user.IoTObjects, { eager: true, onDelete: 'CASCADE' })
  @IsEmpty()
  creator: UserEntity;

  @ManyToOne(() => IoTProjectEntity)
  currentIotProject: IoTProjectEntity;

  @OneToMany(() => IoTProjectObjectEntity, obj => obj.iotObject, { onDelete: 'SET NULL' })
  iotProjectObjects: IoTProjectObjectEntity[];

  @OneToMany(() => IoTProjectObjectEntity, obj => obj.iotTestObject, { onDelete: 'SET NULL' })
  iotProjectTestObjects: IoTProjectObjectEntity[];
}
