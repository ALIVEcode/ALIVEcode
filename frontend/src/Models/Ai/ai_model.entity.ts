import {
	NNModelParams,
	RegModelParams,
	NNHyperparameters,
	RegHyperparameters,
} from '../../Pages/Challenge/ChallengeAI/artificial_intelligence/AIInterfaces';
import { Matrix } from '../../Pages/Challenge/ChallengeAI/artificial_intelligence/AIUtils';
import {
	GenHyperparameters,
	GenModelParams,
} from '../../Pages/Challenge/ChallengeAI/artificial_intelligence/AIInterfaces';

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
 * - GradientDescent
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
	protected abstract hyperparameters: GenHyperparameters;
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
	 * Normalizes a data by subtracting the mean and dividing
	 * by the standard deviation. This function is meant to be used
	 * for a data that is going to be passed as an input but was not part
	 * of the original Dataset.
	 * @param data the data to normalize.
	 * @param mean the mean of the parameter related to this data.
	 * @param deviation the standard deviation of the parameter related to this data.
	 * @returns the normalized data.
	 */
	public normalize(data: number, mean: number, deviation: number): number {
		return (data - mean) / deviation;
	}

	/**
	 * Normalizes an array of numbers by subtracting the mean and dividing
	 * by the standard deviation for each data of the given array. The resulting
	 * array will contain values near zero.
	 * @param data the array to normalize.
	 * @param mean the mean of the parameter in the original Dataset.
	 * @param deviation the standard deviation of the parameter in the original Dataset.
	 * @returns a new array with normalized data.
	 */
	public normalizeArray(
		data: number[],
		mean: number,
		deviation: number,
	): number[] {
		return data.copyWithin(0, 0).map((value: number): number => {
			return this.normalize(value, mean, deviation);
		});
	}

	/**
	 * Normalizes a Matrix by applying the normalize() function to each row,
	 * meaning that each row is normalized separately from the rest of the Matrix.
	 * @param inputs the Matrix to normalize.
	 * @returns a new Matrix with normalized values with respect to their row.
	 */
	public normalizeByRow(inputs: Matrix): Matrix {
		const baseInputs: number[][] = inputs.getValue();
		let normalized: number[][] = [];

		// Check if there is enough means and deviations in the arrays.
		if (
			inputs.getRows() > this.inputMeans.length ||
			inputs.getRows() > this.inputDeviations.length
		) {
			throw new Error(
				'Error: could not normalize data. Some means or deviations were missing.',
			);
		}

		for (let row: number = 0; row < inputs.getRows(); row++) {
			normalized.push(
				this.normalizeArray(
					baseInputs[row],
					this.inputMeans[row],
					this.inputDeviations[row],
				),
			);
		}
		return new Matrix(normalized);
	}

	/**
	 * Sets the properties related to normalization of inputs, which are
	 * the input means and the input deviations. The means and deviations have
	 * to be in the same order as they are in the input Matrix in order to
	 * associate the right parameter with the right mean and deviation.
	 * @param inputMeans the mean of each input parameter in order.
	 * @param inputDeviations the standard deviation of each input parameter in order.
	 * @param outputMean the mean of the output parameter, required if this model is a Regression.
	 * @param outputDeviation the standard deviation of the output parameter, required if this model is a Regression.
	 */
	public abstract setNormalization(
		inputMeans: number[],
		inputDeviations: number[],
		outputMean?: number,
		outputDeviation?: number,
	): void;

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
	 * @returns the outputs of the model.
	 */
	public abstract predict(inputs: Matrix): Matrix;
}
