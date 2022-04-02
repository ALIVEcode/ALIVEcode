/**
 * This file contains all test functions for the AI Neural Network model.
 * The mainAITNeuralNetworkTest function has the task to run the other functions.
 */

import { Matrix } from "../AIUtils";


//Matrices for testing purpose
const mat1: Matrix = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
const mat2: Matrix = new Matrix([[9, 8, 7], [6, 5, 4], [3, 2, 1]]);
const mat3: Matrix = new Matrix([[3, 4], [1, 2]]);
const mat4: Matrix = new Matrix([[2], [3], [4]]);

/**
 * Lauches all test function in this file. The results will appear 
 * in the navigator's console.
 */
export function mainAINeuralNetworkTest() {
  nnPredictTest();
  nnPredictReturnAll();
  nnSetWeightsByLayerTest();
  nnSetBiasesByLayerTest();
}


/**
 * Test function for the predict() method.
 */
function nnPredictTest() {

}

/**
 * Test function for the predictReturnAll() method.
 */
function nnPredictReturnAll() {

}

/**
 * Test function for the setWeightsByLayer() method.
 */
function nnSetWeightsByLayerTest() {

}

/**
 * Test function for the setBiasesByLayer() method.
 */
function nnSetBiasesByLayerTest() {

}