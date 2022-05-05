/**
 * This enum describes all possible types of Model available in AI levels.
 * The current types of Model available are:
 * - NeuralNetwork
 * - Regression
 */
export enum MODEL_TYPES {
	NeuralNetwork,
	Regression,
}

/**
 * This enum describes all possible types of Regression available in AI levels.
 * The current types of Regression available are:
 * - Polynomial
 */
export enum REGRESSION_TYPES {
	Polynomial,
}

/**
 * This enum describes all possible types of optimizers available for Neural Networks
 * in AI levels.
 * The current types of Regression available are:
 * - GradientDescent
 */
export enum NN_OPTIMIZER_TYPES {
	GradientDescent,
}

export class AIModel {
	id: string;

	hyperparameters: object;

	modelParams: object;

	type: MODEL_TYPES;
}
