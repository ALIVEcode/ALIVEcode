import { NNHyperparameters } from '../../AIUtilsInterfaces';
import { Matrix } from '../../AIUtils';
import { NeuralNetwork } from '../../ai_models/ai_neural_networks/NeuralNetwork';
import Optimizer from '../Optimizer';

/**
 * This abstract class represents every type of optimizer algorithm for Neural Network
 * models. All Neural Network optimizers have to extend from this class.
 */
export abstract class NNOptimizer extends Optimizer {
	protected model: NeuralNetwork;
	protected hyperparams: NNHyperparameters;

	/**
	 * Creates an Optimizer for the given Neural Network based on the hyperparameters
	 * object.
	 * @param model the Neural Network to be optimized.
	 * @param hyperparams the object containing all hyperparameters of this Optimizer,
	 * including, but not limited to:
	 * - the learning rate,
	 * - the number of epochs,
	 * - the type of cost function.
	 */
	public constructor(model: NeuralNetwork, hyperparams: NNHyperparameters) {
		super(
			hyperparams.learningRate,
			hyperparams.epochs,
			hyperparams.costFunction,
		);
		this.model = model;
		this.hyperparams = hyperparams;
	}

	public optimize(inputs: Matrix, real: Matrix): NeuralNetwork {
		let predictions: Matrix[];

		for (let i: number = 0; i < this.epochs; i++) {
			predictions = this.model.predictReturnAll(inputs);
			this.optimizeOneEpoch(inputs, predictions, real);
		}
		return this.model;
	}

	/**
	 * Returns the Neural Network optimized by this algorithm.
	 * @returns the associated Neural Network.
	 */
	public getModel(): NeuralNetwork {
		return this.model;
	}
}
