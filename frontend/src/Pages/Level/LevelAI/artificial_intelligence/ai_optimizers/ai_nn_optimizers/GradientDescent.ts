import { matMul, matMulElementWise, Matrix, matMulConstant, zeros, matSubtract, normalizeByRow } from '../../AIUtils';
import { ActivationFunction } from '../../ai_functions/ActivationFunction';
import { NeuralNetwork } from '../../ai_models/ai_neural_networks/NeuralNetwork';
import { NNHyperparameters } from '../../AIEnumsInterfaces';
import { NNOptimizer } from './NNOptimizer';

/**
 * This ANN Optimizer implements the Standard Gradient Descent algogithm to optimize the Model
 * parameters of a NeuralNetwork Model.
 */
export class GradientDescent extends NNOptimizer{
  
  /**
   * Creates a Gradient Descent Optimizer based on the given hyperparameters object to
   * optimize the given model.
   * @param model the Neural Network to optimize with the new object.
   * @param hyperparams the hyperparameters object that defines the Gradient 
   * Descent Optimizer.
   */
  public constructor(model: NeuralNetwork, hyperparams: NNHyperparameters) {
    super(model, hyperparams);
  }

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

  public getModel() {
    return this.model;
  }
}
