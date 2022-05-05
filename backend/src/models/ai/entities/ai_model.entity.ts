import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

export enum MODEL_TYPES {
  NEURAL_NETWORK = 'NN',
  POLY_REGRESSION = 'RP',
}

@Entity()
export class AIModelEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'json', nullable: false })
  hyperparameters: object;

  @Column({ type: 'json', nullable: false })
  modelParams: object;

  @Column({ type: 'enum', enum: MODEL_TYPES, nullable: false })
  type: MODEL_TYPES;
}
