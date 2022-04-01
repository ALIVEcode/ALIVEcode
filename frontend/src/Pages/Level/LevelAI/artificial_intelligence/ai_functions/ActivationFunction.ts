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
export abstract class ActivationFunction 
{

  /**
   * Computes the activation function on each element of a Matrix object.
   * 
   * @param inputs the input Matrix.
   * @returns a new Matrix which is computed by applying the activation function to 
   * each element of the input Matrix.
   */
  public matCompute(inputs: Matrix): Matrix 
  {
    const inputValue: number[][] = inputs.getValue();
    
    const outputValue: number[][] = inputValue.map((value: number[], index: number): number[] => 
    {
        return value.map(this.compute);
    });
    return new Matrix(outputValue);
  }

  /**
   * Computes the activation function's derivative on each element of a Matrix object.
   * For an implementation in a gradient descent algorithm, inputs must be the values
   * computed after the activation function of the current layer (variable a).
   * @param inputs the input Matrix.
   * @returns a new Matrix which is computed by applying the activation function's derivative to 
   * each element of the input Matrix.
   */
  public matDerivative(inputs: Matrix): Matrix
  {
    const inputValue: number[][] = inputs.getValue();
    
    const outputValue: number[][] = inputValue.map((value: number[], index: number): number[] => 
    {
        return value.map(this.derivative);
    });
    return new Matrix(outputValue);
  }

  /**
   * Computes the activation function for a single input and returns the resulting output.
   * @param input the input of the function.
   * @return the corresponding output.
   */
  public abstract compute(input: number): number;

  public abstract derivative(input: number): number;
}

/**
 * This Activation Function implements the Rectified Linear Unit function
 * for a neural layer.
 */
export class Relu extends ActivationFunction {
  public compute(input: number): number {
    return Math.max(0, input);
  }

  public derivative(input: number): number {
    return (input > 0) ? 1 : 0;
  }
}

/**
 * This Activation function implements the Sigmoid function
 * for a neural layer.
 */
export class Sigmoid extends ActivationFunction {
  public compute(input: number): number {
    return 1 / (1 + Math.exp(-input));
  }

  public derivative(input: number): number {
    return input * (1 - input);
  }
}

/**
 * This Activation function implements the Tangent Hyperbolic function 
 * for a neural layer.
 */
export class Tanh extends ActivationFunction
{
  public compute(input: number): number {
    return (Math.exp(input) - Math.exp(-input)) / (Math.exp(input) + Math.exp(-input));;
  }

  public derivative(input: number): number {
    return 1 - Math.pow(input, 2);
  }
}