import { ChallengeEntity, CHALLENGE_TYPE } from "../challenge.entity";
import { Column, ChildEntity, ManyToOne, JoinColumn } from 'typeorm';
import { IsOptional } from 'class-validator';
import { AIDatasetEntity } from '../../../ai/entities/ai_dataset.entity';
import { MODEL_TYPES } from '../../../ai/entities/ai_model.entity';

@ChildEntity(CHALLENGE_TYPE.AI)
export class ChallengeAIEntity extends ChallengeEntity {
  @Column({ nullable: true })
  @IsOptional()
  initialCode?: string;

  @Column({ nullable: true })
  @IsOptional()
  solution?: string;

  @Column({ type: 'enum', enum: MODEL_TYPES, nullable: false, default: MODEL_TYPES.POLY_REGRESSION })
  modelType: MODEL_TYPES;

  @ManyToOne(() => AIDatasetEntity, { nullable: false })
  @JoinColumn({ name: 'datasetId' })
  dataset: AIDatasetEntity;

  @Column({ name: 'datasetId', type: 'varchar', nullable: false })
  datasetId: string;
}
