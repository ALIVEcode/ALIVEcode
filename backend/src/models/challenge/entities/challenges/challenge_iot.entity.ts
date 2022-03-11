import { ChallengeEntity, CHALLENGE_TYPE } from '../challenge.entity';
import { ChildEntity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IoTProjectEntity } from '../../../iot/IoTproject/entities/IoTproject.entity';
import { IsEmpty, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum IOT_CHALLENGE_TYPE {
  SCRIPTING = 'SC',
  UPDATING = 'UP',
}
@ChildEntity(CHALLENGE_TYPE.IOT)
export class ChallengeIoTEntity extends ChallengeEntity {
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

  @Column({ enum: IOT_CHALLENGE_TYPE })
  @IsNotEmpty()
  @IsEnum(IOT_CHALLENGE_TYPE)
  iotType: IOT_CHALLENGE_TYPE;
}
