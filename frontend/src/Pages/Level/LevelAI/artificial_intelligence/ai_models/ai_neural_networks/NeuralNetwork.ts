import { Matrix, randomMatrix, zeros } from '../../AIUtils';
import { NeuralLayer } from "./NeuralLayer";
import { ActivationFunction } from '../../ai_functions/Function';
import { Model } from '../Model';

export class NeuralNetwork extends Model
{
  // The hidden layers plus the output layer. The input layer doesn't need its 
  // own object since it doesn't have weights or biases.
  private layers: NeuralLayer[]; 
  private activationsByLayer: ActivationFunction[];
  private outputActivation: ActivationFunction;

  /**
   * Creates a NeuralNetwork model based on the given hyperparameters related to each layer, the number
   * of inputs and the number of outputs.
   * @param neuronsByLayer the number of neurons for each hidden layer. Its length determines the number of hidden layers.
   * @param activationsByLayer the activation function that will be used for each hidden layer.
   * @param outputActivationn the activation function that will be used for the output layer.
   * @param nbInputs the number of inputs in the model.
   * @param nbOutputs the number of outputs in the model.
   */
  public constructor(neuronsByLayer: number[], activationsByLayer: ActivationFunction[],
                    outputActivation: ActivationFunction, nbInputs: number, nbOutputs: number) 
  {
    super(nbInputs, nbOutputs);
    this.activationsByLayer = activationsByLayer;
    this.outputActivation = outputActivation;

    let weights: Matrix;
    let biases: Matrix;
    let previousNbNeurons = 0;
    let nbLayers: number = neuronsByLayer.length;

    // If the number of activation functions is smaller than the number of layers,
    // fills the activation function array until its of the same length as the number of layers.
    if (activationsByLayer.length < neuronsByLayer.length) 
    {
      for (let i: number = activationsByLayer.length; i < neuronsByLayer.length; i++) 
      {
        activationsByLayer.push(activationsByLayer[i - 1]);
      }
    }

    for (let layer: number = 0; layer < nbLayers; layer++) 
    {
      //Number of neurons from the previous layer (can be the input layer)
      previousNbNeurons = (layer === 0) ? nbInputs : neuronsByLayer[layer - 1];
      weights = randomMatrix(neuronsByLayer[layer], previousNbNeurons);
      biases = new Matrix(zeros(neuronsByLayer[layer], 1));
      if (layer === 0) this.layers = [new NeuralLayer(neuronsByLayer[layer], activationsByLayer[layer], weights, biases)];
      else this.layers.push(new NeuralLayer(neuronsByLayer[layer], activationsByLayer[layer], weights, biases));
    }

    // Output layer
    previousNbNeurons = neuronsByLayer[nbLayers - 1];
    weights = randomMatrix(nbOutputs, previousNbNeurons);
    biases = new Matrix(zeros(nbOutputs, 1));

    this.layers.push(new NeuralLayer(nbOutputs, outputActivation, weights, biases));
  }

  
  public predict(inputs: Matrix): Matrix 
  {
    let output: Matrix = inputs;

    // Computes the outputs for each layer.
    for (let i: number = 0; i < this.layers.length; i++)
    {
      output = this.layers[i].computeLayer(output);
    }
    return output;
  }

  /**
   * Returns the weights Matrix of a specified layer.
   * @param layer the layer's index (starting at 0).
   * @returns the weights Matrix of the layer.
   */
  public getWeightsByLayer(layer: number): Matrix
  {
    return this.layers[layer].getWeights();
  }

  /**
   * Returns the biases Matrix of a specified layer.
   * @param layer the layer's index (starting at 0).
   * @returns the biases Matrix of the layer.
   */
  public getBiasesByLayer(layer: number): Matrix
  {
    return this.layers[layer].getBiases();
  }
  

}