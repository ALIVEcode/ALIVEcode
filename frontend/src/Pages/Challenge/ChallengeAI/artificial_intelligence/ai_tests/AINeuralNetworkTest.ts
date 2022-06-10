import {NeuralNetwork} from "../ai_models/ai_neural_networks/NeuralNetwork";
import {NNHyperparameters} from "../AIUtilsInterfaces";
import {ACTIVATION_FUNCTIONS, COST_FUNCTIONS, NN_OPTIMIZER_TYPES} from "../../../../../Models/Ai/ai_model.entity";
import {Matrix} from "../AIUtils";
import {testLog, TestResult, NO_RESULT, areAllElementsBetweenRange} from "./AITestLogging";
import {mat1} from "./AIUtilsTest"

/**
 * This file contains all test functions for the AI Neural Network model.
 * The mainAITNeuralNetworkTest function has the task to run the other functions.
 */

// Objects for testing purpose
let hyperparameters: NNHyperparameters = {
  nbInputs: 3,
  nbOutputs: 1,
  neuronsByLayer: [4, 4],
  activationsByLayer: [ACTIVATION_FUNCTIONS.TANH, ACTIVATION_FUNCTIONS.SIGMOID],
  costFunction: COST_FUNCTIONS.BINARY_CROSS_ENTROPY,
  learningRate: 0.3,
  epochs: 1000,
  type: NN_OPTIMIZER_TYPES.GradientDescent
};
let nn: NeuralNetwork = new NeuralNetwork("test", hyperparameters);

export {nn};

/**
 * Launches all test function in this file. The results will appear
 * in the navigator's console.
 */
export function mainAINeuralNetworkTest() {
  nnPredictTest();
  nnPredictReturnAll();
  nnSetWeightsByLayerTest();
  nnSetBiasesByLayerTest();
}

/**
 * Test function for predict() method.
 */
function nnPredictTest() {
  const result: Matrix = nn.predict(mat1);

  testLog("NeuralNetwork.predict", result, areAllElementsBetweenRange(result))
}

/**
 * Test function for the predictReturnAll() method.
 */
function nnPredictReturnAll() {
  const result: Matrix[] = nn.predictReturnAll(mat1);

  testLog("NeuralNetwork.predictReturnAll", result, areAllElementsBetweenRange(result))
}

/**
 * Test function for the setWeightsByLayer() method.
 */
function nnSetWeightsByLayerTest() {
  nn.setWeightsByLayer(0, new Matrix([
    [1, 2, 3],
    [5, 6, 7],
    [7, 8, 9],
    [10, 11, 12]
  ]));

  testLog("NeuralNetwork.setWeightsByLayer", NO_RESULT, new TestResult(true))
}

/**
 * Test function for the setBiasesByLayer() method.
 */
function nnSetBiasesByLayerTest() {
  nn.setBiasesByLayer(0, new Matrix([
    [1],
    [2],
    [3],
    [5]
  ]));

  testLog("NeuralNetwork.setBiasesByLayer", NO_RESULT, new TestResult(true))
}