import {
	MODEL_TYPES,
	NNHyperparameters,
	NNModelParams,
	RegModelParams,
	RegHyperparameters as RegHyperparameters,
} from '../AIEnumsInterfaces';
import { Matrix } from '../AIUtils';

export abstract class Model {
	/**
	 * Creates a new Model with the same parameters as the columns in the database.
	 * The modelParams argument can be an empty object if the model has just been created.
	 * @param id
	 * @param hyperparameters
	 * @param mdoelParams
	 * @param type
	 */
	public constructor(protected id: number, protected type: MODEL_TYPES) {}

	protected abstract loadModel(
		modelParams: NNModelParams | RegModelParams,
		hyperparams: NNHyperparameters | RegHyperparameters,
	): void;

	protected abstract createModel(
		hyperparams: NNHyperparameters | RegHyperparameters,
	): void;

	/**
	 * Computes the outputs of the model based on the given inputs.
	 * @param inputs the inputs from which to compute the outputs (1 x nbInputs).
	 * @returns the outputs of the model.
	 */
	public abstract predict(inputs: Matrix): Matrix;

	/**
	 * Predicts outputs based on the corresponding inputs by using the
	 * current weights and biases. Returns an array of Matrices containing the outputs
	 * of all layers in order (each element is the output of one layer).
	 * @param inputs the inputs from which we want to find the outputs.
	 * @returns the outputs of all layers of the model.
	 */
	public abstract predictReturnAll(inputs: Matrix): Matrix[];
}
