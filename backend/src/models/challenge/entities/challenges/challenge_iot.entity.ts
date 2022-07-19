import { ChallengeEntity, CHALLENGE_TYPE } from '../challenge.entity';
import { ChildEntity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IoTProjectEntity } from '../../../iot/IoTproject/entities/IoTproject.entity';
import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

@ChildEntity(CHALLENGE_TYPE.IOT)
export class ChallengeIoTEntity extends ChallengeEntity {
  @ManyToOne(() => IoTProjectEntity)
  @JoinColumn({ name: 'project_id' })
  @IsEmpty()
  project?: IoTProjectEntity;

  @IsNotEmpty()
  @IsString()
  @Column({ name: 'project_id' })
  project_id: string;
}
