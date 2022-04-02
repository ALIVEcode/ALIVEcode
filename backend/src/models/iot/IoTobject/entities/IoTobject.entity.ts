import { IsEmpty } from 'class-validator';
import { Entity, ManyToOne, OneToMany, Column } from 'typeorm';
import { CreatedByUser } from '../../../../generics/entities/createdByUser.entity';
import { UserEntity } from '../../../user/entities/user.entity';
import { IoTProjectEntity } from '../../IoTproject/entities/IoTproject.entity';
import { IoTProjectObjectEntity } from '../../IoTproject/entities/IoTprojectObject.entity';
import { Exclude } from 'class-transformer';
import { IOT_EVENT } from '../../../../socket/iotSocket/iotSocket.types';

export class IoTLog {
  public date: Date;
  constructor(public event: IOT_EVENT, public text: string) {
    this.date = new Date();
  }
}

@Entity()
export class IoTObjectEntity extends CreatedByUser {
  @ManyToOne(() => UserEntity, user => user.IoTObjects, { eager: true, onDelete: 'CASCADE' })
  @IsEmpty()
  creator: UserEntity;

  @Column({ type: 'jsonb', name: 'logs', default: [], nullable: false })
  @Exclude({ toClassOnly: true })
  logs: IoTLog[];

  @ManyToOne(() => IoTProjectEntity, { nullable: true, onDelete: 'SET NULL' })
  @Exclude({ toClassOnly: true })
  currentIotProject?: IoTProjectEntity;

  @OneToMany(() => IoTProjectObjectEntity, obj => obj.iotObject, { onDelete: 'SET NULL' })
  @Exclude({ toClassOnly: true })
  iotProjectObjects: IoTProjectObjectEntity[];

  @OneToMany(() => IoTProjectObjectEntity, obj => obj.iotTestObject, { onDelete: 'SET NULL' })
  @Exclude({ toClassOnly: true })
  iotProjectTestObjects: IoTProjectObjectEntity[];
}
