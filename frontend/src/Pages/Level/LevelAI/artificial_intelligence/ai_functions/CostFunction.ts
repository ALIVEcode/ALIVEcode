import { Matrix, matMulConstant, matSubtract, matDivElementWise, matAbs } from '../AIUtils';

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
  * @param predicted the Matrix of predicted values. Has to be sized as (nbElements x 1).
  * @param real the Matrix of real values. Has to be the same size as the predicted Matrix.
  * @returns the computed error depending on the choosen cost function, or -1 if one of  the Matrices
  * is not of the correct size.
  */
  public matCompute(predicted: Matrix, real: Matrix): number
  {
    // The number of rows has to be equal for the two Matrices.
    if (predicted.getRows() !== real.getRows()) return -1;
    // The number of columns has to be equal to 1.
    if (predicted.getColumns() !== 1 || real.getColumns() !== 1) return -1;

    return this.compute(predicted.getValue(), real.getValue());
  }

  /**
  * Computes the cost function on the given predicted values and real values.
  * Both arrays must have the same size.
  * @param predicted the predicted values.
  * @param real the corresponding real values.
  * @return the value of the cost function.
  */
  public abstract compute(predicted: number[][], real: number[][]): number;

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
export class MeanSquaredError extends CostFunction
{
  public compute(predicted: number[][], real: number[][]): number
  {
    const nbElements: number = predicted.length;
    let sum: number = 0;

    for (let row: number = 0; row < nbElements; row++)
    {
      sum += Math.pow((predicted[row][0] - real[row][0]), 2);
    }
    return sum / nbElements;
  }

  public matDerivative(predicted: Matrix, real: Matrix): Matrix 
  {
    return matMulConstant(matSubtract(predicted, real), 2);
  }
}

/**
* This cost function implements the mean absolute error for 
* an array of predicted values and their corresponding real
* values.
*/
export class MeanAbsoluteError extends CostFunction
{
  public compute(predicted: number[][], real: number[][]): number
  {
    
    const nbElements: number = predicted.length;
    let sum: number = 0;

    // Formula : 1/m * |a - y|
    for (let row: number = 0; row < nbElements; row++)
    {
      sum += Math.abs((predicted[row][0] - real[row][0]));
    }
    return sum / nbElements;
  }

  public matDerivative(predicted: Matrix, real: Matrix): Matrix
  {
    // Formula : (a - y) / |a - y|
    return matDivElementWise(matSubtract(predicted, real), matAbs(matSubtract(predicted, real)));
  }
}

/**
* This cost function implements the binary cross entropy for 
* an array of predicted values and their corresponding real
* values. Its outputs are in the range [0, 1]
*/
export class BinaryCrossEntropy extends CostFunction
{
  public compute(predicted: number[][], real: number[][]): number
  {
    const nbElements: number = predicted.length;
    let sum: number = 0;
    let pred: number, expec: number;

    for (let row: number = 0; row < nbElements; row++)
    {
      pred = predicted[row][0];
      expec = real[row][0];
      sum += -(expec * Math.log(pred) + (1 - expec) * Math.log(1 - pred));
    }
    return sum / nbElements;
}

  public matDerivative(predicted: Matrix, real: Matrix): Matrix 
  {
    // Formula : a - y
    return matSubtract(predicted, real);
  }
}
