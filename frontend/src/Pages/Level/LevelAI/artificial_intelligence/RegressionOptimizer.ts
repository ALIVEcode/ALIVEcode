import PolyRegression from '../../../../Components/LevelComponents/LevelGraph/PolyRegression';
import DataSample from './DataSample';

/**
 * Superclass for every Optimizer class. It contains all usefull static and abstract methods 
 * for AI algorithms and optimization techniques.
 * 
 * @author Félix Jobin
 */
export default abstract class RegressionOptimizer {
	protected EPSILON: number = 1e-8;
	protected error: number;

	/**
	 * Creates a RegressionOptimizer with a Regression object.
	 * @param regression the regression to optimize.
	 * @param learningRate the learning rate of the optimizer.
	 * @param epoch the number of times the algorithm will update parameters.
	 */
	constructor(
		protected regression: PolyRegression,
		protected learningRate: number,
		protected epoch: number,
		protected costFunc: (predicted: number[], real: number[]) => number,
	) {}

	/**
	 * Returns the calculated error of the optimizer.
	 * @returns the calculated error.
	 */
	public getError() {
		return this.error;
	}

	/**
	 * Computes the sigmoid function with the specified parameter.
	 * @param x the input of the sigmoid function.
	 * @returns the corresponding output.
	 */
	public static sigmoid(x: number): number {
		return 1 / (1 + Math.pow(Math.E, -x));
	}

	/**
	 * Computes the sigmoid function for an array of inputs.
	 * @param x the input array.
	 * @returns the array of corresponding outputs.
	 */
	public static sigmoidAll(x: number[]): number[] {
		return x.map((sample: number) => this.sigmoid(sample));
	}
	/**
	 * Computes the ReLU function (max(0, x)) with the specified input.
	 * @param x the input of the ReLU function.
	 * @returns the corresponding output.
	 */
	public static relu(x: number): number {
		return x > 0 ? x : 0;
	}

	/**
	 * Computes the relu function for an array of inputs.
	 * @param x the array of inputs.
	 * @returns the array of corresponding outputs.
	 */
	public static reluAll(x: number[]): number[] {
		return x.map(sample => RegressionOptimizer.relu(sample));
	}

	/**
	 * Computes the mean squared error (MSE) with a predicted value and its corresponding
	 * real value (for the same value of input parameters).
	 * @param predicted the predicted value.
	 * @param real the expected value.
	 * @returns the mean squared error between the two values.
	 */
	public static MSE(predicted: number, real: number): number {
		return Math.pow(predicted - real, 2);
	}

	/**
	 * Computes the mean squared error on an array of predicted and real values and
	 * returns the mean for all of them.
	 * @param predicted the array of predicted values.
	 * @param real the array of expected values.
	 * @returns the mean of all mean squared errors.
	 */
	public static costMSE(predicted: number[], real: number[]): number {
		if (predicted.length !== real.length)
			throw new Error('Lists are not the same length');

		let sum: number = 0;
		for (let i: number = 0; i < predicted.length; i++) {
			sum += RegressionOptimizer.MSE(predicted[i], real[i]);
		}
		
		return Math.round(sum / predicted.length);
	}

	/**
	 * Computes the loss function of the form -(yln(y^) + (1 - y)*ln(1 - y^))
	 * @param predicted the predicted value.
	 * @param real the expected value.
	 * @returns the error.
	 */
	public static loss(predicted: number, real: number): number {
		return -(real * Math.log(predicted) + (1 - real) * Math.log(1 - predicted));
	}

	/**
	 * Calculates the mean all losses for the whole dataset and returns the result.
	 * @param predicted the predicted values.
	 * @param real the real values.
	 * @returns the mean of all losses.
	 */
	public static costLoss(predicted: number[], real: number[]): number {
		if (predicted.length !== real.length)
			throw new Error('Lists are not the same length');

		let sum: number = 0;
		for (let i: number = 0; i < predicted.length; i++) {
			sum += RegressionOptimizer.loss(predicted[i], real[i]);
		}

		return sum / predicted.length;
	}

	/**
	 * Calculates and returns the mean of the input array.
	 * @param data the input array.
	 * @returns the mean of the input.
	 */
	public static mean(data: number[]): number {
		return (
			data.reduce((total: number, sample: number) => total + sample, 0) /
			data.length
		);
	}

	/**
	 * Calculates and returns the standard deviation of the input array.
	 * @param data the input array.
	 * @returns the standard deviation of the input.
	 */
	public static stdDev(data: number[]): number {
		const mean: number = RegressionOptimizer.mean(data);
		const numerator: number = data
			.map((sample: number) => Math.pow(sample - mean, 2))
			.reduce((total: number, sample: number) => total + sample, 0);
		return Math.sqrt(numerator / data.length);
	}

	/**
	 * Returns the normalized dataset by substracting the mean and dividing by the
	 * standard deviation of the dataset.
	 * @param data the input array.
	 * @returns the normalized dataset.
	 */
	public static normalize(data: number[]): number[] {
		const mean: number = RegressionOptimizer.mean(data);
		const stdDev: number = RegressionOptimizer.stdDev(data);

		return data.map((sample: number) => (sample - mean) / stdDev);
	}

	/**
	 * Computes the derivative of the cost function on a selected amount of predicted and real values.
	 * @param predicted the array of predicted values.
	 * @param real the array of expected values.
	 * @return the calculated cost derivative.
	 */
	protected abstract costDerivative(
		predicted: number[],
		real: number[],
	): number;

	/**
	 * COmputes the derivative of the specified parameter of the model with an array of input values.
	 * @param param the parameter for which the derivative is calculated.
	 * @param inputs the array of input values.
	 * @param costDeriv the calculated cost derivative for the same inputs.
	 * @return the calculated parameter's derivative.
	 */
	protected abstract paramDerivative(
		param: string,
		costDeriv: number,
		inputs: number[],
	): number;

	/**
	 * Returns a new Regression that is as close as possible of the given dataset.
	 * @param dataset the dataset to fit.
	 * @return a new Regression that fits best the dataset.
	 */
	public abstract optimize(dataset: DataSample[]): PolyRegression;
}