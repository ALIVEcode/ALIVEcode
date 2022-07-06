import RegressionOptimizer from './RegressionOptimizer';
import { GenRegression } from '../../AIUtilsInterfaces';
import {
	DataSample,
	Matrix,
	matMulElementWise,
	matPowElementWise,
	mean,
} from '../../AIUtils';
import { PolyRegression } from '../../ai_models/ai_regression/PolyRegression';
import { Sigmoid } from '../../ai_functions/ActivationFunction';

/**
 * This class contains all necessary methods to optimize a polynomial regression
 * of the third degree maximum.
 * It uses the mean squared error as its loss function and sigmoid as its activation
 * function.
 * The polynomial regression always stay of the same degree after the optimization.
 */
export default class PolyOptimizer extends RegressionOptimizer {
	private error: number = 0;
	private gradientDirection = -1;

	/**
	 * Computes and returns the derivative of the polynomial regression for the specified parameter.
	 * @param param the parameter of the regression to derivate from, either 'a', 'b', 'c' or 'd'.
	 * @param costDeriv the cost derivative of the model. Computable with the costDerivative function.
	 * @param inputs
	 * @returns the parameter's corresponding derivative.
	 */
	protected paramDerivative(
		param: string,
		costDeriv: Matrix,
		inputs: Matrix,
	): number {
		// The two Matrices have to be of the same size
		if (!costDeriv.sameSize(inputs)) {
			throw new Error(
				'Error: could not calculate the derivative for this Regression. Inputs Matrix and Cost derivative Matrix are not the same size.',
			);
		}
		let pow: number = 0;
		if (param === 'a') pow = 3;
		else if (param === 'b') pow = 2;
		else if (param === 'c') pow = 1;
		else if (param === 'd') pow = 0;
		else
			throw new Error(
				"Error: could not calculate the derivative for this Regression. The parameter doesn't exist",
			);

		const mulResult: Matrix = matMulElementWise(
			costDeriv,
			matPowElementWise(inputs, pow),
		);
		return mean(mulResult.getValue()[0]);
	}

	public optimizeOneEpoch(
		inputs: Matrix,
		outputArray: Matrix,
		real: Matrix,
	): void {
		let costDev: Matrix;
		let da, db, dc, dd: number;

		// Normalization of outputs for smaller values
		const actFunc: Sigmoid = new Sigmoid();
		const activatedPred: Matrix = actFunc.matCompute(
			outputArray,
		);
		const activatedReal: Matrix = actFunc.matCompute(
			real,
		);

		// Backpropagation
		// 1. Cost derivative
		costDev = this.costFunc.matDerivative(activatedPred, activatedReal);

		// 2. Computation of derivatives
		// We multiply by param/param to avoid increasing a 0 variable
		da =
			this.paramDerivative('a', costDev, inputs) *
			this.gradientDirection *
			(this.model.getA() / (this.model.getA() + RegressionOptimizer.EPSILON));
		db =
			this.paramDerivative('b', costDev, inputs) *
			this.gradientDirection *
			(this.model.getB() / (this.model.getB() + RegressionOptimizer.EPSILON));
		dc =
			this.paramDerivative('c', costDev, inputs) *
			this.gradientDirection *
			(this.model.getC() / (this.model.getC() + RegressionOptimizer.EPSILON));
		dd =
			this.paramDerivative('d', costDev, inputs) *
			this.gradientDirection *
			(this.model.getD() / (this.model.getD() + RegressionOptimizer.EPSILON));

		// 3. Parameter update
		this.model.setParams([
			this.model.getA() - this.learningRate * da,
			this.model.getB() - this.learningRate * db,
			this.model.getC() - this.learningRate * dc,
			this.model.getD() - this.learningRate * dd,
		]);

		// 3. Recalculate predictions
		if (this.costFunc.matCompute(outputArray, real) > this.error) {
			this.gradientDirection = this.gradientDirection * -1;
		}

		this.error = this.costFunc.matCompute(outputArray, real);
	}

	public optimize(inputs: Matrix, real: Matrix): PolyRegression {
		let predictions: Matrix;

		for (let i: number = 0; i < this.epochs; i++) {
			predictions = this.model.predict(inputs);
			this.optimizeOneEpoch(inputs, predictions, real);
		}
		return this.model;
	}

	/**
	 * Returns the Regression optimized by this algorithm.
	 * @returns the associated Regression.
	 */
	public getRegression(): PolyRegression {
		return this.model;
	}
}

/*
public optimize(dataset: DataSample[]): PolyRegression {
		let numEpoch: number = 0;
		let gradientDirection = -1;

		// Initial values
		const independent: number[] = dataset.map(
			(sample: DataSample) => sample['x'],
		);
		const normIndependent: number[] =
			RegressionOptimizer.normalize(independent);
		const expected: number[] = dataset.map((sample: DataSample) => sample['y']);
		const normExpected: number[] = RegressionOptimizer.normalize(expected);
		const activatedExp: number[] = RegressionOptimizer.sigmoidAll(normExpected);

		let predicted: number[] = this.model.computeAll(normIndependent);
		let normPredicted: number[] = RegressionOptimizer.normalize(predicted);
		let activatedPred: number[] = RegressionOptimizer.sigmoidAll(normPredicted);
		this.error = this.costFunc(activatedPred, activatedExp);

		// Copy of the PolyRegression
		let regCopy: PolyRegression = this.model.copy();
		while (numEpoch < this.epoch) {
			// Backpropagation
			// 1. Cost derivative
			let costDev = this.costDerivative(activatedPred, activatedExp);
			// 2. Parameter update
			// We multiply by param/param to avoid increasing a 0 variable
			regCopy.setParams(
				regCopy.getA() -
					this.learningRate *
						this.paramDerivative('a', costDev, independent) *
						gradientDirection *
						(regCopy.getA() / (regCopy.getA() + this.EPSILON)),
				regCopy.getB() -
					this.learningRate *
						this.paramDerivative('b', costDev, independent) *
						gradientDirection *
						(regCopy.getB() / (regCopy.getB() + this.EPSILON)),
				regCopy.getC() -
					this.learningRate *
						this.paramDerivative('c', costDev, independent) *
						gradientDirection *
						(regCopy.getC() / (regCopy.getC() + this.EPSILON)),
				regCopy.getD() -
					this.learningRate *
						this.paramDerivative('d', costDev, independent) *
						gradientDirection *
						(regCopy.getD() / (regCopy.getD() + this.EPSILON)),
			);

			// 3. Recalculate predictions
			predicted = regCopy.computeAll(independent);
			normPredicted = RegressionOptimizer.normalize(predicted);
			activatedPred = RegressionOptimizer.sigmoidAll(
				RegressionOptimizer.normalize(predicted),
			);
			if (this.costFunc(predicted, expected) > this.error)
				gradientDirection = gradientDirection * -1;
			this.error = this.costFunc(predicted, expected);
			numEpoch++;
		}
		console.log(regCopy);
		return regCopy;
	}
*/
