import { Matrix } from '../../Pages/Challenge/ChallengeAI/artificial_intelligence/AIUtils';
import { GenModelParams } from '../../Pages/Challenge/ChallengeAI/artificial_intelligence/AIUtilsInterfaces';

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
	PERCEPTRON = 'PERC'
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
 * This abstract class represents every AI Model available in AI challenges.
 * It contains core properties and methods common to all AI Models, and every
 * new class representing a specific type of model should extend from this class.
 */
export default abstract class AIModel {
	protected id: string | null;
	protected type: MODEL_TYPES;
	protected abstract modelParams: GenModelParams;
	protected inputMeans: number[] = [0];
	protected inputDeviations: number[] = [1];

	/**
	 * Creates a new Model with the same parameters as the columns in the database.
	 * The modelParams argument can be an empty object if the model has just been created.
	 * @param id
	 * @param type
	 */
	public constructor(id: string | null, type: MODEL_TYPES) {
		this.id = id;
		this.type = type;
	}

	/**
	 * Loads an existing model into this object. This method is only called by the
	 * class's constructor when the modelParams property already contains values
	 * for the model's parameters.
	 */
	protected abstract loadModel(): void;

	/**
	 * Creates a new model into this object by initializing its model parameters.
	 * This method is only called by the class's constructor when the modelParams
	 * property do not already contain values for the model's parameters.
	 */
	protected abstract createModel(): void;

	/**
	 * Computes the outputs of the model based on the given inputs. Also applies
	 * the normalization of inputs by taking the mean and deviation of each parameter
	 * in arrays.
	 * @param inputs the inputs from which to compute the outputs (1 x nbInputs).
	 * @param normalize a boolean indicating if we want to normalize the data.
	 * @returns the outputs of the model.
	 */
	public abstract predict(inputs: Matrix): Matrix;
}
