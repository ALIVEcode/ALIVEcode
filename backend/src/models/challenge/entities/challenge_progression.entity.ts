import { Exclude } from 'class-transformer';
import { IsEmpty, IsOptional } from 'class-validator';
import { GenHyperparameters } from '../../../models/ai/entities/AIUtilsInterfaces';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';
import { AIModelEntity } from '../../ai/entities/ai_model.entity';
import { IoTProjectEntity } from '../../iot/IoTproject/entities/IoTproject.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { ChallengeEntity } from './challenge.entity';

export type ChallengeAliveProgressionData = {
  code?: string;
};

export type ChallengeAIProgressionData = {
  code?: string;
  hyperparams: GenHyperparameters;
  ioCodes: number[];
};

export type ChallengeCodeProgressionData = {
  code?: string;
};

export type ChallengeIoTProgressionData = never;

export type ChallengeProgressionData =
  | ChallengeAliveProgressionData
  | ChallengeCodeProgressionData
  | ChallengeAIProgressionData
  | ChallengeIoTProgressionData;

@Entity()
export class ChallengeProgressionEntity {
  @PrimaryGeneratedColumn()
  @IsEmpty()
  @Exclude({ toClassOnly: true })
  id: string;

  @ManyToOne(() => ChallengeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'challengeId' })
  @IsEmpty()
  challenge: ChallengeEntity;

  @Column({ nullable: false, name: 'challengeId' })
  @Exclude()
  @IsEmpty()
  challengeId: string;

  @OneToOne(() => IoTProjectEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'iotProjectId' })
  @Exclude()
  iotProject: IoTProjectEntity;

  @Column({ name: 'iotProjectId', nullable: true })
  iotProjectId: string;

  @Column({ type: 'json', default: () => "'{}'" })
  @IsOptional()
  data: ChallengeProgressionData;

  @OneToOne(() => AIModelEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'aiModelId' })
  aiModel: AIModelEntity;

  @Column({ name: 'aiModelId', type: 'varchar', nullable: true })
  aiModelId: string;

  @ManyToOne(() => UserEntity, user => user.challengeProgressions, { onDelete: 'CASCADE' })
  user: UserEntity;
}
