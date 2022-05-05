import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

/**
 * Different types of Models (Neural Network, Poly Regression, etc.)
 */
export enum MODEL_TYPES {
  NEURAL_NETWORK = 'NN',
  POLY_REGRESSION = 'RP',
}

/**
 * AIModel entity in the database. The model contains the hyperparameters, an id and modelParams varying
 * depending on the MODEL_TYPES (Neural Network, Poly Regression, etc.)
 */
@Entity()
export class AIModelEntity {
  /** Id of the model entity */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Hyperparameters of the model (depends on its type) */
  @Column({ type: 'json', nullable: false })
  hyperparameters: object;

  /** Parameters and state of the model (biases, weights, layers, etc.) */
  @Column({ type: 'json', nullable: false })
  modelParams: object;

  /** Type of the model (Neural Network, Poly Regression, etc.) */
  @Column({ type: 'enum', enum: MODEL_TYPES, nullable: false })
  type: MODEL_TYPES;
}
