import { LevelEntity } from "./level.entity";
import { ChildEntity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IoTProjectEntity } from '../../iot/IoTproject/entities/IoTproject.entity';
import { IsEmpty, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum IOT_LEVEL_TYPE {
  SCRIPTING = 'SC',
  UPDATING = 'UP',
}
@ChildEntity()
export class LevelIoTEntity extends LevelEntity {
  @ManyToOne(() => IoTProjectEntity, { eager: true })
  @JoinColumn({ name: 'project_id' })
  @IsEmpty()
  project?: IoTProjectEntity;

  @IsNotEmpty()
  @IsString()
  @Column({ name: 'project_id' })
  project_id: string;

  @Column({ nullable: true })
  @IsOptional()
  initialCode?: string;

  @Column({ nullable: true })
  @IsOptional()
  solution?: string;

  @Column({ enum: IOT_LEVEL_TYPE })
  @IsNotEmpty()
  @IsEnum(IOT_LEVEL_TYPE)
  iotType: IOT_LEVEL_TYPE;
}
