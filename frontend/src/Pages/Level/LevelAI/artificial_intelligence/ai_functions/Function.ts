import { Matrix } from "../AIUtils";

/**
 * This class contains sll the activation functions available in the AI module.
 * The functions created with that class can be used to compute the activation
 * function on each element of a Matrix object.
 * 
 * The activation functions implemented are :
 * - the Rectified Linear Unit function;
 * - the Sigmoid funciton;
 * - the Tangent Hyperbolic function.
 */
export class ActivationFunction {

  static RELU: number = 0;
  static SIGMOID: number = 1;
  static TANH: number = 2;

  /**
   * Creates an activation function of the type specified.
   * 
   * @param type the type of activation function. It can be :
   * - ActivationFunction.RELU for a Rectified Linear Unit function;
   * - ActivationFunction.SIGMOID for a Sigmoid function;
   * - ActivationFunction.TANH for a Tangent Hyperbolic function.
   */
  constructor(
    private type: number
  ) {}

  /**
   * Computes the activation function on each element of a Matrix object.
   * 
   * @param inputs the input Matrix.
   * @returns a new Matrix which is computed by applying the activation function to 
   * each element of the input Matrix.
   */
  public compute(inputs: Matrix): Matrix {
    const inputValue: number[][] = inputs.getValue();
    
    const outputValue: number[][] = inputValue.map(
      (value: number[], index: number): number[] => {
        let mapOutput: number[] = [0];
        switch (this.type) {
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
  private computeReLU(input: number): number {
    return Math.max(0, input);
  }

  /**
   * Computes the Sigmoid function on a single input.
   * 
   * @param input the input number of the function.
   * @returns the corresponding output.
   */
  private computeSigmoid(input: number): number {
    return 1 / (1 + Math.exp(-input));
  }

  /**
   * Computes the Tangent Hyperbolic function on a single input.
   * 
   * @param input the input number of the function.
   * @returns the corresponding output.
   */
  private computeTanH(input: number): number {
    return (Math.exp(input) - Math.exp(-input)) / (Math.exp(input) + Math.exp(-input));
  }

}

export class CostFunction {

  static MSE: number = 0;
  static MAE: number = 0;

  
}
