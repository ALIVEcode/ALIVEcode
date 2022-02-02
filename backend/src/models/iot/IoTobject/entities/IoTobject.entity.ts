import { IsNotEmpty, IsEmpty } from 'class-validator';
import { Column, Entity, ManyToOne, ManyToMany } from 'typeorm';
import { CreatedByUser } from '../../../../generics/entities/createdByUser.entity';
import { UserEntity } from '../../../user/entities/user.entity';
import { IoTProjectEntity } from '../../IoTproject/entities/IoTproject.entity';

export enum IoTObjectLabel {
  HOME = 'HO',
  OTHER = 'OT',
}

@Entity()
export class IoTObjectEntity extends CreatedByUser {
  @ManyToOne(() => UserEntity, user => user.IoTObjects, { eager: true, onDelete: 'CASCADE' })
  @IsEmpty()
  creator: UserEntity;

  @Column({ enum: IoTObjectLabel })
  @IsNotEmpty()
  label: IoTObjectLabel;

  @ManyToMany(() => IoTProjectEntity, project => project.iotObjects, { onDelete: 'CASCADE' })
  @IsEmpty()
  iotProjects: IoTProjectEntity[];
}
