import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { IoTObjectEntity } from '../../IoTobject/entities/IoTobject.entity';
import { IoTProjectEntity } from './IoTproject.entity';
import { IsEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';
import { IoTScriptEntity } from './IoTscript.entity';

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

  @OneToOne(() => IoTScriptEntity, script => script.iotProjectObject, { onDelete: 'SET NULL' })
  @Exclude({ toClassOnly: true })
  @JoinColumn({ name: 'iotScriptId' })
  iotScript?: IoTScriptEntity;

  @Column({ name: 'iotScriptId', type: 'varchar', nullable: true })
  @Exclude({ toClassOnly: true })
  iotScriptId?: string;

  @Column({ type: 'enum', enum: PROJECT_OBJECT_TARGET, default: PROJECT_OBJECT_TARGET.OBJECT, nullable: false })
  @Exclude({ toClassOnly: true })
  currentTarget: PROJECT_OBJECT_TARGET;
}