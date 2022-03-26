import { Matrix } from "./AIUtils";

/**
 * This file contains all test functions for the AI module.
 * The mainAITest function has the task to run the other functions.
 */

const mat1: Matrix = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
const mat2: Matrix = new Matrix([[9, 8, 7], [6, 5, 4], [3, 2, 1]]);
const mat3: Matrix = new Matrix([[3, 4], [1, 2]]);
const mat4: Matrix = new Matrix([[2], [3], [4]]);

export function mainAITest() {
  matSumOfAllTest();
  matGetMatrixColumnTest();
  matGetMatrixRowTest();
  matAddConstantTest();
  matAddTest();
  matMulTest();
  appendRowTest();
}

//-------------- TEST FUNCTIONS FOR AIUtils ----------------//

/**
 * Test for the sumOfAll function of the Matrix class.
 */
function matSumOfAllTest() {
  const result: number = mat1.sumOfAll();
  const expected: number = 45;

  let resultMessage: string = result === expected ? "Success" : "Failure";
  console.log("Test for sumOfAll function : " + resultMessage);
}

/**
 * Test for the getMatrixColumn function of the Matrix class.
 */
function matGetMatrixColumnTest() {

}

/**
 * Test for the getMatrixRow function of the Matrix class.
 */
function matGetMatrixRowTest() {

}

/**
 * Test for the matAddConstant function of the AIUtils module.
 */
function matAddConstantTest() {

}

/**
 * Test for the matAdd function of the AIUtils class.
 */
function matAddTest() {

}


function matMulTest() {

}

function appendRowTest() {

}

function randomMatrixTest() {

}
