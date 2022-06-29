import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * This enum describles all possible types of Cost Function available in AI challenges.
 * The current types of Cost Function available are:
 * - MEAN_SQUARED_ERROR
 * - MEAN_ABSOLUTE_ERROR
 * - BINARY_CROSS_ENTROPY
 */
 export enum COST_FUNCTIONS {
	MEAN_SQUARED_ERROR = 'MSE',
	MEAN_ABSOLUTE_ERROR = 'MAE',
	BINARY_CROSS_ENTROPY = 'BCE',
}

/**
 * This enum describles all possible types of Activation Function available in AI challenges.
 * The current types of Activation Function available are:
 * - RELU
 * - SIGMOID
 * - TANH
 */
export enum ACTIVATION_FUNCTIONS {
	RELU = 'RE',
	SIGMOID = 'SI',
	TANH = 'TA',
}

/**
 * This enum describes all possible types of Model available in AI challenges.
 * The current types of Model available are:
 * - NeuralNetwork
 * - Regression
 */
export enum MODEL_TYPES {
	NEURAL_NETWORK = 'NN',
	POLY_REGRESSION = 'POLY',
}

/**
 * This enum describes all possible types of optimizers available for Neural Networks
 * in AI challenges.
 * The current types of Regression available are:
 * - GradientDescentScheme.tsx
 */
export enum NN_OPTIMIZER_TYPES {
	GradientDescent = 'GD',
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
