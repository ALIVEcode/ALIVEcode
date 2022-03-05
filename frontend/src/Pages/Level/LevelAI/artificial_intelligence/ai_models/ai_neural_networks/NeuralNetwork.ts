import { Matrix, normalMatrix, zeros } from '../../AIUtils';
import { NeuralLayer } from "./NeuralLayer";
import { ActivationFunction } from '../../ai_functions/Function';

export class NeuralNetwork {

  private layers: NeuralLayer[];

  /**
   * Creates a NeuralNetwork model based on the given hyperparameters related to each layer, the number
   * of inputs and the number of outputs.
   * @param neuronsByLayer the number of neurons for each hidden layer. Its length determines the number of hidden layers.
   * @param activationsByLayer the activation function that will be used for each hidden layer.
   * @param outputActivationn the activation function that will be used for the output layer.
   * @param nbInputs the number of inputs in the model.
   * @param nbOutputs the number of outputs in the model.
   */
  public constructor(
    neuronsByLayer: number[], // 
    private activationsByLayer: ActivationFunction[],
    private outputActivationn: ActivationFunction,
    private nbInputs: number,
    private nbOutputs: number
  ) {
    let weights: Matrix;
    let biases: Matrix;
    let previousNbNeurons = 0;
    let nbLayers: number = neuronsByLayer.length;

    // If the number of activation functions is smaller than the number of layers,
    // fills the activation function array until its of the same length as the number of layers.
    if (activationsByLayer.length < neuronsByLayer.length) {
      for (let i: number = activationsByLayer.length; i < neuronsByLayer.length; i++) {
        activationsByLayer.push(activationsByLayer[i - 1]);
      }
    }
    for (let layer: number = 0; layer < nbLayers; layer++) {

      //Number of neurons from the previous layer (can be the input layer)
      previousNbNeurons = (layer === 0) ? nbInputs : neuronsByLayer[layer - 1];
      weights = normalMatrix(neuronsByLayer[layer], previousNbNeurons);
      biases = new Matrix(zeros(neuronsByLayer[layer], 1));

      this.layers.push(new NeuralLayer(neuronsByLayer[layer], activationsByLayer[layer], weights, biases));
    }

    // Output layer
    previousNbNeurons = neuronsByLayer[nbLayers - 1];
    weights = normalMatrix(nbOutputs, previousNbNeurons);
    biases = new Matrix(zeros(nbOutputs, 1));

    this.layers.push(new NeuralLayer(nbOutputs, outputActivationn, weights, biases));
  }

  /**
   * Computes the outputs of the model based on the given inputs.
   * @param inputs the inputs from which to compute the outputs.
   * @returns the outputs of the model.
   */
  public predict(inputs: Matrix): Matrix {
    let output: Matrix = inputs;

    // Computes the outputs for each layer.
    for (let i: number = 0; i < this.layers.length; i++) {
      output = this.layers[i].computeLayer(output);
    }
    return output;
  }
}