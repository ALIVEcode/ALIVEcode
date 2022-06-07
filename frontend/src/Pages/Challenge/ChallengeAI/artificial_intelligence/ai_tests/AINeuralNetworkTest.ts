import {NeuralNetwork} from "../ai_models/ai_neural_networks/NeuralNetwork";
import {NNHyperparameters} from "../AIUtilsInterfaces";
import {ACTIVATION_FUNCTIONS, COST_FUNCTIONS, NN_OPTIMIZER_TYPES} from "../../../../../Models/Ai/ai_model.entity";
import {Matrix} from "../AIUtils";
import {testLog, TestResult, NO_RESULT} from "./AITestLogging";

/**
 * This file contains all test functions for the AI Neural Network model.
 * The mainAITNeuralNetworkTest function has the task to run the other functions.
 */

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

//Matrices for testing purpose
const mat1: Matrix = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
const mat2: Matrix = new Matrix([[9, 8, 7], [6, 5, 4], [3, 2, 1]]);
const mat3: Matrix = new Matrix([[3, 4], [1, 2]]);
const mat4: Matrix = new Matrix([[2], [3], [4]]);

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
 * Helper functions
 */

function areAllElementsBetweenRange(matOrMatArray: Matrix | Matrix[], lowerBound: number = 0, upperBound: number = 1): TestResult {
  let result: boolean = true;
  if (matOrMatArray instanceof Matrix) {
    const rawMat: number[][] = matOrMatArray.getValue();
    const rowCount: number = matOrMatArray.getRows();
    const colCount: number = matOrMatArray.getColumns();

    for (let i: number = 0; result && i < rowCount; i++) {
      for (let j: number = 0; result && j < colCount; j++) {
        const value: number = rawMat[i][j]
        if (!(lowerBound <= value && value <= upperBound)) result = false;
      }
    }
  } else {
    for (let i: number = 0; i < matOrMatArray.length; i++) {
      if (!(areAllElementsBetweenRange(matOrMatArray[i]).isSuccessful)) result = false;
    }
  }

  return new TestResult(result, "at least one value was not in the range [" + lowerBound + ", " + upperBound + "]");
}

/**
 * Test function for predict() method.
 */
function nnPredictTest() {
  const result: Matrix = nn.predict(mat1, false);

  testLog("NeuralNetwork.predict", result, areAllElementsBetweenRange(result))
}

/**
 * Test function for the predictReturnAll() method.
 */
function nnPredictReturnAll() {
  const result: Matrix[] = nn.predictReturnAll(mat1, false);

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
    [4]
  ]));

  testLog("NeuralNetwork.setBiasesByLayer", NO_RESULT, new TestResult(true))
}