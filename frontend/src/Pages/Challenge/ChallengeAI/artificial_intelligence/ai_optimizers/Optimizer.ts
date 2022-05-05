import { Matrix } from '../AIUtils';
import { CostFunction } from '../ai_functions/CostFunction';
import { NeuralNetwork } from '../ai_models/ai_neural_networks/NeuralNetwork';
import { Model } from '../ai_models/Model';

/**
 * This abstract class defines every type of algorithm that can optimize a Machine Learning
 * Model. All types of optimizer must extend from this class.
 */
export abstract class Optimizer {
	/**
	 * Constructor of an Optimizer. Every optimizer has to set a learning rate and a number
	 * of epochs.
	 * @param learningRate the learning rate of the optimizer.
	 * @param epochs the number of epochs assigned to this optimizer.
	 */
	public constructor(
		protected learningRate: number,
		protected epochs: number,
		protected costFunc: CostFunction,
	) {}

	/**
	 * Optimizez the optimizer's modedl by applying one iteration of the optimizer's algorithm.
	 * @param inputs the training dataset as a Matrix.
	 * @param outputArray a Matrix array of outputs from each model's layers.
	 * @param real the expected outputs for each input data.
	 */
	public abstract optimizeOneEpoch(
		inputs: Matrix,
		outputArray: Matrix[],
		real: Matrix,
	): void;

	/**
	 * Runs the Optimizer's algorithm on the model by plugging the input Matrix and the
	 * expected values. The method goes through this algorithm for x iteration, where x is the
	 * number of epochs.
	 * The returned model is a Neual Network with parameters that are set in a way that minimizes the
	 * cost function of the optimizer. This can be achieved by making the model return values that are
	 * as close as possible to the given expected values for their corresponding input data.
	 * @param inputs the training set of the model.
	 * @param real the expected values for each data.
	 * @returns the model with optimized parameters.
	 */
	public abstract optimize(inputs: Matrix, real: Matrix): Model | NeuralNetwork;

	/**
	 * Returns the Cost Function object of this optimizer.
	 * @returns the Cost Fuction.
	 */
	public getCostFunction(): CostFunction {
		return this.costFunc;
	}
}
