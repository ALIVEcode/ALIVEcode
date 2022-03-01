import { Matrix, matMul } from "../../AIUtils";

/**
 * This class represents the core of a neuron in a neural network. 
 * It contains its associated weights and bias, and a method that can compute 
 * an output Matrix based on an input Matrix.
 */
export default class Neuron {

  /**
   * Creates a Neuron by specifying its weight and bias values.
   * @param bias the bias value.
   * @param weights the weights values, as a 1-column Matrix object.
   */
  constructor(
    private bias: number,
    private weights: Matrix
  ) {
    if (weights.getRows() > 1) {
      weights.setValue([weights.getValue()[0]]);
    }
  }

  /**
   * Computes the output of the neuron based on the given inputs and 
   * its parameters. TODO Also applies the Activation function of its layer.
   * @param inputs the inputs of the neuron.
   * @returns the computed output
   */
  public computeOutput(inputs: Matrix): Matrix {
    let output: Matrix = matMul(inputs, this.weights);
    return output;
  }

}