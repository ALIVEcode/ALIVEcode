import {appendRow, matAdd, matAddConstant, matDivElementWise, matMul, Matrix} from '../AIUtils';

/**
 * This file contains all test functions for the AI module.
 * The mainAITest function has the task to run the other functions.
 */

// Matrices for testing purpose
const mat1: Matrix = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
const mat2: Matrix = new Matrix([[9, 8, 7], [6, 5, 4], [3, 2, 1]]);
const mat3: Matrix = new Matrix([[3, 4], [1, 2]]);
const mat4: Matrix = new Matrix([[2], [3], [4]]);
const mat5: Matrix = new Matrix([[1, 2], [3, 4], [5, 6]]);

/**
 * Simplify test logging.
 */
function testLog<T>(functionName: string, result: T, expected: T) {
  let resultMessage: string = result === expected ? "Success" : "Failure";
  console.log("Test for " + functionName + " function : " + resultMessage);
}

/**
 * Launches all test function in this file. The results will appear
 * in the navigator's console.
 */
export function mainAIUtilsTest() {
  matSumOfAllTest();
  matTransposeTest();
  matGetMatrixColumnTest();
  matAddConstantTest();
  matAddTest();
  matDivElementWiseTest();
  matMulTest();
  appendRowTest();
}

//-------------- TEST FUNCTIONS FOR Matrix CLASS ----------------//

/**
 * Test for the sumOfAll function of the Matrix class.
 */
function matSumOfAllTest() {
  testLog("Matrix.sumOfAll()", mat1.sumOfAll(), 45)
}

function matTransposeTest() {
  const result = mat1.transpose();
  const expected = new Matrix([
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9]
  ]);

  testLog("Matrix.transpose()", result, expected);
}

function matGetMatrixColumnTest() {
  testLog("Matrix.getMatrixColumn()", mat1.getMatrixColumn(2), new Matrix([[101, 102, 103], [104, 105, 106], [107, 108, 109]]));
}

//-------------- TEST FUNCTIONS FOR Matrix CLASS ----------------//

/**
 * Test for the matAddConstant function of the AIUtils module.
 */
function matAddConstantTest() {
  testLog("matAddConstantTest()", matAddConstant(mat1, 100), new Matrix([[10, 10, 10], [10, 10, 10], [10, 10, 10]]));
}

/**
 * Test for the matAdd function of the AIUtils class.
 */
function matAddTest() {
  testLog("matAddTest()", matAdd(mat1, mat2), new Matrix([[10, 10, 10], [10, 10, 10], [10, 10, 10]]));
}

function matDivElementWiseTest() {
  const result: Matrix = matDivElementWise(mat1, mat2);
  const expected: Matrix = new Matrix([
      [1/9, 1/4, 3/7],
      [2/3, 1, 3/2],
      [7/3, 4, 9]
  ]);

  testLog("matDivElementWise()", result, expected);
}

function matMulTest() {
  const result: Matrix = matMul(mat1, mat5);
  const expected = new Matrix([
      [22, 28],
      [49, 64],
      [76, 100]
  ]);

  testLog("MatMul()", result, expected);
}

function appendRowTest() {
  testLog("MatMul()", appendRow(mat3, new Matrix([[5, 6]])), mat5);
}

