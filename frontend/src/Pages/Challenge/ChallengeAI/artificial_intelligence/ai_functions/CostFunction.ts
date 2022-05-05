import {
	Matrix,
	matMulConstant,
	matSubtract,
	matDivElementWise,
	matAbs,
	matMulElementWise,
} from '../AIUtils';

/**
 * This class contains all the available cost functions in the AI module.
 * The functions created with that class can be used to compute the cost
 * function on the elements in a predicted Matrix and a real Matrix in order
 * to compare their values.
 *
 * The activation functions implemented are :
 * - the Rectified Linear Unit function;
 * - the Sigmoid funciton;
 * - the Tangent Hyperbolic function.
 */
export abstract class CostFunction {
	/**
	 * Computes the cost function on the given predicted Matrix and real Matrix. Returns -1
	 * if the format of a Matrix doesn't fit the requirements.
	 *
	 * @param predicted the Matrix of predicted values. Has to be sized as (nbOutputs x nbData).
	 * @param real the Matrix of real values. Has to be the same size as the predicted Matrix.
	 * @returns the computed error depending on the choosen cost function, or -1 if one of the Matrices
	 * is not of the correct size.
	 */
	public abstract matCompute(predicted: Matrix, real: Matrix): number;

	/**
	 * Computes the derivative of the cost function on all elements in a Matrix by
	 * using the predicted values Matrix and the real values Matrix.
	 * Both Matrices must have the same size.
	 * @param predicted the predicted values's Matrix.
	 * @param real the real values's Matrix.
	 * @return the Matrix of all computed derivatives.
	 */
	public abstract matDerivative(predicted: Matrix, real: Matrix): Matrix;
}

/**
 * This cost function implements the mean squared error for
 * an array of predicted values and their corresponding real
 * values.
 */
export class MeanSquaredError extends CostFunction {
	public matCompute(predicted: Matrix, real: Matrix): number {
		// The number of rows has to be equal for the two Matrices.
		if (
			predicted.getRows() !== real.getRows() ||
			predicted.getColumns() !== real.getColumns()
		)
			return -1;

		const nbElements: number = predicted.getColumns() * predicted.getRows(); //The total number of generated outputs
		let sum: number;

		let diff: Matrix = matSubtract(predicted, real);
		sum = matMulElementWise(diff, diff).sumOfAll();
		return sum / nbElements;
	}

	public matDerivative(predicted: Matrix, real: Matrix): Matrix {
		return matMulConstant(matSubtract(predicted, real), 2);
	}
}

/**
 * This cost function implements the mean absolute error for
 * an array of predicted values and their corresponding real
 * values.
 */
export class MeanAbsoluteError extends CostFunction {
	public matCompute(predicted: Matrix, real: Matrix): number {
		// The number of rows has to be equal for the two Matrices.
		if (
			predicted.getRows() !== real.getRows() ||
			predicted.getColumns() !== real.getColumns()
		)
			return -1;

		const nbElements: number = predicted.getColumns() * predicted.getRows(); //The total number of generated outputs
		let sum: number;

		// Formula : 1/m * |a - y|
		let diff: Matrix = matAbs(matSubtract(predicted, real));
		sum = diff.sumOfAll();
		return sum / nbElements;
	}

	public matDerivative(predicted: Matrix, real: Matrix): Matrix {
		// Formula : (a - y) / |a - y|
		return matDivElementWise(
			matSubtract(predicted, real),
			matAbs(matSubtract(predicted, real)),
		);
	}
}

/**
 * This cost function implements the binary cross entropy for
 * an array of predicted values and their corresponding real
 * values. Its outputs are in the range [0, 1]
 */
export class BinaryCrossEntropy extends CostFunction {
	public matCompute(matPredicted: Matrix, matReal: Matrix): number {
		// The number of rows has to be equal for the two Matrices.
		if (
			matPredicted.getRows() !== matReal.getRows() ||
			matPredicted.getColumns() !== matReal.getColumns()
		)
			return -1;

		const predicted: number[][] = matPredicted.getValue();
		const real: number[][] = matReal.getValue();
		const nbElements: number =
			matPredicted.getColumns() * matPredicted.getRows(); //The total number of generated outputs
		let sum: number = 0;
		let pred: number, expec: number;

		for (let row: number = 0; row < matPredicted.getRows(); row++) {
			for (let col: number = 0; col < matPredicted.getColumns(); col++) {
				pred = predicted[row][col];
				expec = real[row][col];
				sum += -(expec * Math.log(pred) + (1 - expec) * Math.log(1 - pred));
			}
		}
		return sum / nbElements;
	}

	public matDerivative(predicted: Matrix, real: Matrix): Matrix {
		// Formula : a - y
		return matSubtract(predicted, real);
	}
}
