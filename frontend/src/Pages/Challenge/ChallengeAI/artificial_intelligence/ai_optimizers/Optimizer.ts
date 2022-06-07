import { Matrix } from '../AIUtils';
import { CostFunction } from '../ai_functions/CostFunction';
import { COST_FUNCTIONS } from '../../../../../Models/Ai/ai_model.entity';
import { GenAIModel, GenHyperparameters } from '../AIUtilsInterfaces';

/**
 * This abstract class defines every type of algorithm that can optimize a Machine Learning
 * Model. All types of optimizer must extend from this class.
 */
export default abstract class Optimizer {
	protected abstract hyperparams: any;
	protected abstract model: GenAIModel;
	// The following properties are already available in the hyperparams property. They are used for
	// conveninence purpose.
	protected learningRate: number;
	protected epochs: number;
	protected costFunc: CostFunction;

	/**
	 * Constructor of an Optimizer. Every optimizer has to set a learning rate, a number
	 * of epochs and a Cost Function.
	 * @param learningRate the learning rate of the optimizer.
	 * @param epochs the number of epochs assigned to this optimizer.
	 * @param costFunc the Cost Function that will minimize the optimizer.
	 */
	public constructor(
		learningRate: number,
		epochs: number,
		costFunc: COST_FUNCTIONS,
	) {
		this.learningRate = learningRate;
		this.epochs = epochs;
		this.costFunc = CostFunction.createCostFunction(costFunc);
	}

	/**
	 * Optimizez the optimizer's model by applying one iteration of the optimizer's algorithm.
	 * @param inputs the training dataset as a Matrix.
	 * @param outputArray a Matrix array of outputs from each model's layers.
	 * @param real the expected outputs for each input data.
	 */
	public abstract optimizeOneEpoch(
		inputs: Matrix,
		outputArray: Matrix[] | Matrix,
		real: Matrix,
	): void;

	/**
	 * Runs the Optimizer's algorithm on the model by plugging the input Matrix and the
	 * expected values. The method goes through this algorithm for x iteration, where x is the
	 * number of epochs.
	 *
	 * The returned model is a Neual Network with parameters that are set in a way that minimizes the
	 * cost function of the optimizer. This can be achieved by making the model return values that are
	 * as close as possible to the given expected values for their corresponding input data.
	 * @param inputs the training set of the model.
	 * @param real the expected values for each data.
	 * @returns the model with optimized parameters.
	 */
	public abstract optimize(inputs: Matrix, real: Matrix): GenAIModel;

	public computeCost(inputs: Matrix, real: Matrix): number {
		return this.costFunc.matCompute(this.model.predict(inputs, false), real);
	}

	/**
	 * Returns the Cost Function object of this optimizer.
	 * @returns the Cost Fuction.
	 */
	public getCostFunction(): CostFunction {
		return this.costFunc;
	}

	/**
	 * Sets the learning rate of this optimizer with the value in arguments.
	 * @param newLr the new value for the learning rate.
	 */
	public setLearningRate(newLr: number): void {
		this.learningRate = newLr;
	}

	/**
	 * Sets the number of epochs of this optimizer with the value in arguments.
	 * @param newEpochs the new value for the number of epochs.
	 */
	public setEpochs(newEpochs: number): void {
		this.epochs = newEpochs;
	}
}
