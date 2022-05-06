import {
	NNModelParams,
	RegModelParams,
	NNHyperparameters,
	RegHyperparameters,
} from '../../Pages/Challenge/ChallengeAI/artificial_intelligence/AIEnumsInterfaces';
import { Matrix } from '../../Pages/Challenge/ChallengeAI/artificial_intelligence/AIUtils';

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
	POLY_REGRESSION = 'RP',
}

/**
 * This enum describes all possible types of Regression available in AI challenges.
 * The current types of Regression available are:
 * - Polynomial
 */
export enum REGRESSION_TYPES {
	Polynomial = 'PO',
}

/**
 * This enum describes all possible types of optimizers available for Neural Networks
 * in AI challenges.
 * The current types of Regression available are:
 * - GradientDescent
 */
export enum NN_OPTIMIZER_TYPES {
	GradientDescent = 'GD',
}

export default abstract class AIModel {
	public id: string;
	public type: MODEL_TYPES;
	abstract hyperparameters: object;
	abstract modelParams: object;

	/**
	 * Creates a new Model with the same parameters as the columns in the database.
	 * The modelParams argument can be an empty object if the model has just been created.
	 * @param id
	 * @param type
	 */
	public constructor(id: string, type: MODEL_TYPES) {
		this.id = id;
		this.type = type;
	}

	protected abstract loadModel(): void;

	protected abstract createModel(): void;

	/**
	 * Computes the outputs of the model based on the given inputs.
	 * @param inputs the inputs from which to compute the outputs (1 x nbInputs).
	 * @returns the outputs of the model.
	 */
	public abstract predict(inputs: Matrix | number): Matrix | number;
}
