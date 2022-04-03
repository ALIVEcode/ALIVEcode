import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IoTObjectEntity } from '../../IoTobject/entities/IoTobject.entity';
import { IoTProjectEntity } from './IoTproject.entity';
import { IsEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';
import { AsScriptEntity } from '../../../as-script/entities/as-script.entity';

export enum PROJECT_OBJECT_TARGET {
  OBJECT = 'O',
  TEST = 'T',
}

@Entity()
export class IoTProjectObjectEntity {
  @PrimaryGeneratedColumn('increment')
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  id: number;

  @ManyToOne(() => IoTProjectEntity, project => project.iotProjectObjects)
  @Exclude({ toClassOnly: true })
  iotProject: IoTProjectEntity;

  @ManyToOne(() => IoTObjectEntity, obj => obj.iotProjectObjects, { eager: true, onDelete: 'SET NULL' })
  @Exclude({ toClassOnly: true })
  iotObject?: IoTObjectEntity;

  @ManyToOne(() => IoTObjectEntity, obj => obj.iotProjectObjects, { eager: true, onDelete: 'SET NULL' })
  @Exclude({ toClassOnly: true })
  iotTestObject?: IoTObjectEntity;

  @ManyToOne(() => AsScriptEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'scriptId' })
  @Exclude({ toClassOnly: true })
  script?: AsScriptEntity;

  @Column({ name: 'scriptId', type: 'varchar', nullable: true })
  @Exclude({ toClassOnly: true })
  scriptId?: string;

  @Column({ type: 'enum', enum: PROJECT_OBJECT_TARGET, default: PROJECT_OBJECT_TARGET.OBJECT, nullable: false })
  @Exclude({ toClassOnly: true })
  currentTarget: PROJECT_OBJECT_TARGET;
}