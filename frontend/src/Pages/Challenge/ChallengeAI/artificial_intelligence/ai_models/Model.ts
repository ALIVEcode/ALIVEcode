import { MODEL_TYPES } from '../../../../../Models/Ai/ai_model.entity';
import {
	NNModelParams,
	RegModelParams,
	NNHyperparameters,
	RegHyperparameters,
} from '../AIEnumsInterfaces';
import { Matrix } from '../AIUtils';

export abstract class Model {
	protected id: number;
	protected type: MODEL_TYPES;

	/**
	 * Creates a new Model with the same parameters as the columns in the database.
	 * The modelParams argument can be an empty object if the model has just been created.
	 * @param id
	 * @param hyperparameters
	 * @param mdoelParams
	 * @param type
	 */
	public constructor(id: number, type: MODEL_TYPES) {
		this.id = id;
		this.type = type;
	}

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
	public abstract predict(inputs: Matrix | number): Matrix | number;
}
