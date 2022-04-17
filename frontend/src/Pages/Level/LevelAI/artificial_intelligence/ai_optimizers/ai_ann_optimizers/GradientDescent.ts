import { matMul, matMulElementWise, Matrix, matMulConstant, zeros, matSubtract, matAdd, normalize, normalizeByRow } from '../../AIUtils';
import { ActivationFunction } from '../../ai_functions/ActivationFunction';
import { CostFunction } from '../../ai_functions/CostFunction';
import { NeuralNetwork } from '../../ai_models/ai_neural_networks/NeuralNetwork';

export class GradientDescent
{
  private learningRate: number;
  private epochs: number;
  private model: NeuralNetwork;
  private costFunc: CostFunction;
  
  /**
   * Creates a new GradientDescent optimiser by setting its properties to the given values.
   * @param model the model assigned to this optimizer.
   * @param costFunc the Cost Function that will be used in the optimization.
   * @param learningRate the learning rate of this optimizer.
   * @param epochs the number of epochs of this optimizer.
   */
  public constructor(model: NeuralNetwork, costFunc: CostFunction, learningRate: number, epochs: number) {
    this.learningRate = learningRate;
    this.epochs = epochs;
    this.model = model;
    this.costFunc = costFunc;
  }

  /**
   * Optimizez the optimizer's modedl by applying one iteration of the gradient descent algorithm.
   * @param inputs the training dataset as a Matrix.
   * @param outputArray a Matrix array of outputs from each model's layers.
   * @param real the expected outputs for each input data.
   */
  public optimizeOneEpoch(inputs: Matrix, outputArray: Matrix[], real: Matrix) {
    const activations: ActivationFunction[] = this.model.getAllActivations();
    const nbLayers: number = this.model.getAllActivations().length;
    const inputArray: Matrix[] = [normalizeByRow(inputs)].concat(outputArray).slice(0, -1);
    const nbData: number = inputs.getValue()[0].length;
    const predicted: Matrix = outputArray[outputArray.length - 1];
    const oldWeights: Matrix[] = this.model.getAllWeights();
    
    let dz: Matrix = new Matrix(zeros(1, 1)); // Derivative with respect to the inputs of the layer.
    let dw: Matrix; // Derivative with respect to the weights of the layer.
    let db: Matrix; // Derivative with respect to the biases of the layer.
    let newWeights: Matrix; // New values of weights calculated for a layer.
    let newBiases: Matrix; // New values of biases calculated for a layer.

    for (let layer: number = nbLayers - 1; layer >= 0; layer--) {
      if (layer !== nbLayers - 1) { // Calculation of dz for the output layer
        dz = matMul(oldWeights[layer+1].transpose(), dz)
        dz = matMulElementWise(dz, activations[layer].matDerivative(outputArray[layer]));
      } 
      else { // Calculation of dz for hidden layers
        let actDev: Matrix = activations[layer].matDerivative(outputArray[layer]);
        dz = matMulElementWise(this.costFunc.matDerivative(predicted, real), actDev);
      }

      // Calculation of dw for each layer
      dw = matMulConstant(matMul(dz, inputArray[layer].transpose()), 1 / nbData);

      // Calculation of new weights for each layer
      newWeights = matSubtract(this.model.getWeightsByLayer(layer), matMulConstant(dw, this.learningRate));
      this.model.setWeightsByLayer(layer, newWeights);

      // Calculation of db for each layer
      db = matMulConstant( dz.sumOfAllRows(), 1 / nbData);
      // Calculation of new biases for each layer
      newBiases = matSubtract(this.model.getBiasesByLayer(layer), matMulConstant(db, this.learningRate));
      this.model.setBiasesByLayer(layer, newBiases);
    }
  }

  /**
   * Runs the gradient descent algorithm on the model by plugging the input Matrix and the 
   * expected values. The method goes through this algorithm for x iteration, where x is the
   * number of epochs.
   * The returned model is a Neual Network with parameters that are set in a way that minimizes the
   * cost function of the optimizer. This can be achieved by making the model return values that are 
   * as close as possible to the given expected values for their corresponding input data.
   * @param inputs the training set of the model.
   * @param real the expected values for each data.
   * @returns the model with optimized parameters.
   */
  public optimize(inputs: Matrix, real: Matrix): NeuralNetwork {
    let predictions: Matrix[];
    
    for (let i: number = 0; i < this.epochs; i++) {
      predictions = this.model.predictReturnAll(inputs);
      this.optimizeOneEpoch(inputs, predictions, real);
    }
    return this.model;
  }

  public getModel() {
    return this.model;
  }
}