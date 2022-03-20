import { Matrix } from "../AIUtils";

/**
 * This class contains all the available activation functions in the AI module.
 * The functions created with that class can be used to compute the activation
 * function on each element of a Matrix object.
 * 
 * The activation functions implemented are :
 * - the Rectified Linear Unit function;
 * - the Sigmoid funciton;
 * - the Tangent Hyperbolic function.
 */
export class ActivationFunction 
{

  static RELU: number = 0;
  static SIGMOID: number = 1;
  static TANH: number = 2;

  private type: number;

  /**
   * Creates an activation function of the type specified.
   * 
   * @param type the type of activation function. It can be :
   * - ActivationFunction.RELU for a Rectified Linear Unit function;
   * - ActivationFunction.SIGMOID for a Sigmoid function;
   * - ActivationFunction.TANH for a Tangent Hyperbolic function.
   */
  constructor(type: number) 
  {
    this.type = type;
  }

  /**
   * Computes the activation function on each element of a Matrix object.
   * 
   * @param inputs the input Matrix.
   * @returns a new Matrix which is computed by applying the activation function to 
   * each element of the input Matrix.
   */
  public compute(inputs: Matrix): Matrix 
  {
    const inputValue: number[][] = inputs.getValue();
    
    const outputValue: number[][] = inputValue.map
    (
      (value: number[], index: number): number[] => {
        let mapOutput: number[] = [0];
        switch (this.type) 
        {
          case ActivationFunction.RELU:
            mapOutput = value.map(this.computeReLU);
            break;
          case ActivationFunction.SIGMOID:
            mapOutput = value.map(this.computeSigmoid);
            break;
          case ActivationFunction.TANH:
            mapOutput = value.map(this.computeTanH);
        }
        return mapOutput;
      }
    );
    
    return new Matrix(outputValue);
  }

  /**
   * Computes the Rectified Linear Unit function on a single input.
   * 
   * @param input the input number of the function.
   * @returns the corresponding output.
   */
  private computeReLU(input: number): number 
  {
    return Math.max(0, input);
  }

  /**
   * Computes the Sigmoid function on a single input.
   * 
   * @param input the input number of the function.
   * @returns the corresponding output.
   */
  private computeSigmoid(input: number): number 
  {
    return 1 / (1 + Math.exp(-input));
  }

  /**
   * Computes the Tangent Hyperbolic function on a single input.
   * 
   * @param input the input number of the function.
   * @returns the corresponding output.
   */
  private computeTanH(input: number): number 
  {
    return (Math.exp(input) - Math.exp(-input)) / (Math.exp(input) + Math.exp(-input));
  }

}

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
export class CostFunction 
{
  static MSE: number = 0;
  static MAE: number = 1;
  static BINARY_CROSS_ENTROPY: number = 2;

  private type: number;

  /**
   * Creates a CostFunction of the type specified.
   * 
   * @param type the type of CostFunction. It can be: 
   * - CostFunction.MSE for a Mean Squared Error function.
   * - CostFunction.MAE for a Mean Absolute Error function.
   * - CostFunction.BINARY_CROSS_ENTROPY for a Binary Cross Entropy function.
   */
  public constructor(type: number)
  {
    this.type = type;
  }

  /**
   * Computes the cost function on the given predicted Matrix and real Matrix. Returns -1
   * if the format of a Matrix doesn't fit the requirements.
   * 
   * @param predicted the Matrix of predicted values. Has to be sized as (nbElements x 1).
   * @param real the Matrix of real values. Has to be the same size as the predicted Matrix.
   * @returns the computed error depending on the choosen cost function, or -1 if one of  the Matrices
   * is not of the correct size.
   */
  public compute(predicted: Matrix, real: Matrix): number
  {
    let error: number = 0;

    // The number of rows has to be equal for the two Matrices.
    if (predicted.getRows() !== real.getRows()) return -1;
    // The number of columns has to be equal to 1.
    if (predicted.getColumns() !== 1 || real.getColumns() !== 1) return -1;

    switch(this.type)
    {
      case CostFunction.MSE:
        error = this.computeMSE(predicted.getValue(), real.getValue());
        break;
      case CostFunction.MAE:
        error = this.computeMAE(predicted.getValue(), real.getValue());
        break;
      case CostFunction.BINARY_CROSS_ENTROPY:
        error = this.computeBCE(predicted.getValue(), real.getValue());
        break;
    }
    return error;
  }

  /**
   * Computes and returns the Mean Squared Error between predicted values and real values.
   * @param predicted the column array of predicted values (nbElements x 1).
   * @param real the column array of real values (nbElements x 1).
   * @returns the computed Mean Squared error.
   */
  private computeMSE(predicted: number[][], real: number[][]): number
  {
    const nbElements: number = predicted.length;
    let sum: number = 0;

    for (let row: number = 0; row < nbElements; row++)
    {
      sum += Math.pow((predicted[row][0] - real[row][0]), 2);
    }
    return sum / nbElements;
  }

  /**
   * Computes and returns the Mean Absolute Error between predicted values and real values.
   * @param predicted the column array of predicted values (nbElements x 1).
   * @param real the column array of real values (nbElements x 1).
   * @returns the computed Mean Absolute error.
   */
  private computeMAE(predicted: number[][], real: number[][]): number
  {
    const nbElements: number = predicted.length;
    let sum: number = 0;

    for (let row: number = 0; row < nbElements; row++)
    {
      sum += Math.abs((predicted[row][0] - real[row][0]));
    }
    return sum / nbElements;
  }

  /**
   * Computes and returns the Binary Cross Entropy between predicted values and real values.
   * @param predicted the column array of predicted values (nbElements x 1).
   * @param real the column array of real values (nbElements x 1).
   * @returns the Binary Cross Entropy.
   */
  private computeBCE(predicted: number[][], real: number[][]): number
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
}

