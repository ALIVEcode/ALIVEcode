import { Matrix, zeros, matMul } from "../../AIUtils";
import { ActivationFunction } from "../../ai_functions/Function";

// Configuration for the matrix library


export default class Neuron {

  constructor(
    private bias: number,
    private weights: Matrix,
    private activation: ActivationFunction
  ) {}

  /**
   * Computes the output of the neuron based on the given inputs and 
   * its parameters. Also applies the layer
   * @param inputs the inputs of the neuron.
   * @returns the computed output
   */
  public computeOutput(inputs: Matrix): Matrix {
    return new Matrix(1, 1);
  }

}