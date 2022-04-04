import { Matrix, matMul, matAddConstant } from "../../AIUtils";
import { ActivationFunction } from '../../ai_functions/Function';

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
    /*
    if (weights.getRows() > 1) {
      weights.setValue([weights.getValue()[0]]);
    }
    */
  }

  /**
   * Computes the output of the neuron based on the given inputs and 
   * its parameters. Also applies the Activation function of its layer.
   * @param inputs the inputs of the neuron.
   * @returns the computed output
   */
  public computeOutput(inputs: Matrix, activation: ActivationFunction): Matrix {
    
    this.weights.display()
    let output: Matrix = matMul(this.weights, inputs);

    console.log("After weights :")
    output.display();

    output = matAddConstant(output, this.bias);

    console.log("After biases :")
    output.display();

    return activation.compute(output);
  }

  /**
   * Sets the weights Matrix to the one given in parameter.
   * This method is only called by the Neuron's Layer.
   * @param newWeights the new weights Matrix.
   */
  setWeights(newWeights: Matrix)
  {
    this.weights = newWeights;
  }

  /**
   * Sets the bias to the one given in parameter.
   * This method is only called by the Neuron's Layer.
   * @param newBias the new bias.
   */
  setBias(newBias: number)
  {
    this.bias = newBias;
  }
}