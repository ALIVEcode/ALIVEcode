import { ActivationFunction } from "../../ai_functions/Function";
import Neuron from "./Neuron";
import { Matrix, appendRow } from '../../AIUtils';

/**
 * This class represents a layer of a neural newtwork.
 * It contains its neurons and an activation function.
 */
export class NeuralLayer {

  private neurons: Neuron[] = [];
  private activation: ActivationFunction;
  private weights: Matrix;
  private biases: Matrix;

  /**
   * Creates a NeuralLayer by creating its neurons based on the given 
   * parameters.
   * @param nbNeurons the number of neurons in the NeuralLayer.
   * @param activation the ActivationFunction of the layer.
   * @param weights the weights of all neurons in the layer (nbPrevious x nbNeurons).
   * @param biases the biases of all neurons in the layer (1 x nbNeurons).
   */
  public constructor(nbNeurons: number, activation: ActivationFunction, weights: Matrix, biases: Matrix)
  {
    this.activation = activation;
    this.weights = weights;
    this.biases = biases;

    // Creates every neuron in the layer.
    for (let i: number = 0; i < nbNeurons; i++) {
      this.neurons.push(new Neuron(biases.getValue()[i][0], weights.getMatrixRow(i)));
    }
  }
  
  /**
   * Computes the output of a layer in a neural network and returns the result of
   * all neurons in the layer into one Matrix.
   * @param inputs the output from the previous NeuralLayer.
   * @returns the output of the whole layer.
   */
  public computeLayer(inputs: Matrix): Matrix {
    let output: Matrix = this.neurons[0].computeOutput(inputs, this.activation);
    for (let i: number = 1; i < this.neurons.length; i++) {
      const newOutput: Matrix = this.neurons[i].computeOutput(inputs, this.activation);
      console.log("To append :")
      newOutput.display()
      output = appendRow(output, newOutput);
    }

    console.log("After layer :")
    output.display();
    return output;
  }

  public getWeights(): Matrix
  {
    return this.weights;
  }

  public getBiases(): Matrix
  {
    return this.biases;
  }
}