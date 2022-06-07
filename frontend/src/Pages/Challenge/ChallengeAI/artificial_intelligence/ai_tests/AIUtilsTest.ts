import { testLog } from './AITestLogging';
import {
	appendRow,
	matAdd,
	matAddConstant,
	matDivElementWise,
	matMul,
	Matrix,
} from '../AIUtils';

/**
 * This file contains all test functions for the AI module.
 * The mainAITest function has the task to run the other functions.
 */

// Matrices for testing purpose
const mat1: Matrix = new Matrix([
	[1, 2, 3],
	[4, 5, 6],
	[7, 8, 9],
]);
const mat2: Matrix = new Matrix([
	[9, 8, 7],
	[6, 5, 4],
	[3, 2, 1],
]);
const mat3: Matrix = new Matrix([
	[3, 4],
	[1, 2],
]);
const mat4: Matrix = new Matrix([
	[1, 2],
	[3, 4],
	[5, 6],
]);

/**
 * Simplify test logging.
 */
/*
function testLog<T>(functionName: string, result: T, expected: T) {
  let same: boolean;
  let isMatrix: boolean = result instanceof Matrix;
  if (isMatrix) {
    // @ts-ignore
    same = result.equals(expected);
    isMatrix = true;
  } else {
    same = result === expected;
    isMatrix = false;
  }

  let resultMessage: string = same ? "PASS" : "FAIL";
  console.log("Test for " + functionName + " function : " + resultMessage);

  if (!same) {
    if (isMatrix) {
      console.log("RESULT: ");
      // @ts-ignore
      result.display();
      console.log("EXPECTED: ");
      // @ts-ignore
      expected.display();
    } else if (!isMatrix) {
      console.log("RESULT: ");
      console.log(result);
      console.log("EXPECTED: ");
      console.log(expected);
    }
  }

  return same;
}
*/
/**
 * Launches all test function in this file. The results will appear
 * in the navigator's console.
 */
export function mainAIUtilsTest() {
	// It looks like the order of functions make some tests PASS and other FAIL. This means that one or more of these functions is modifying one or more of the five matrices declared above.
	matAddTest();
	matSumOfAllTest();
	matTransposeTest();
	matGetMatrixColumnTest();
	matAddConstantTest();
	matDivElementWiseTest();
	matMulTest();
	appendRowTest();
	matEqualsTest();
}

//-------------- TEST FUNCTIONS FOR Matrix CLASS ----------------//

/**
 * Test for the sumOfAll function of the Matrix class.
 */
function matSumOfAllTest() {
	testLog('Matrix.sumOfAll', mat1.sumOfAll(), 45);
}

function matTransposeTest() {
	const result = mat1.transpose();
	const expected = new Matrix([
		[1, 4, 7],
		[2, 5, 8],
		[3, 6, 9],
	]);

	testLog('Matrix.transpose()', result, expected);
}

function matGetMatrixColumnTest() {
  const result = mat1.getMatrixColumn(1);
  const expected = new Matrix([[2], [5], [8]])

	testLog('Matrix.getMatrixColumn', result, expected);
}

//-------------- TEST FUNCTIONS FOR Matrix CLASS ----------------//

/**
 * Test for the matAddConstant function of the AIUtils module.
 */
function matAddConstantTest() {
	testLog(
		'matAddConstantTest',
		matAddConstant(mat1, 100),
		new Matrix([
			[101, 102, 103],
			[104, 105, 106],
			[107, 108, 109],
		]),
	);
}

/**
 * Test for the matAdd function of the AIUtils class.
 */
function matAddTest() {
	const result = matAdd(mat1, mat2);
	const expected = new Matrix([
		[10, 10, 10],
		[10, 10, 10],
		[10, 10, 10],
	]);

	testLog('matAddTest', result, expected);
}

function matDivElementWiseTest() {
	const result: Matrix = matDivElementWise(mat1, mat2);
	const expected: Matrix = new Matrix([
		[1 / 9, 1 / 4, 3 / 7],
		[2 / 3, 1, 3 / 2],
		[7 / 3, 4, 9],
	]);

	testLog('matDivElementWise', result, expected);
}

function matMulTest() {
	const result: Matrix = matMul(mat1, mat4);
	const expected = new Matrix([
		[22, 28],
		[49, 64],
		[76, 100],
	]);

	testLog('MatMul', result, expected);
}

function appendRowTest() {
	testLog(
		'appendRow',
		appendRow(mat3, new Matrix([[5, 6]])),
		new Matrix([
			[3, 4],
			[1, 2],
			[5, 6],
		]),
	);
}

function matEqualsTest() {
	let result = mat2.equals(
		new Matrix([
			[9, 8, 7],
			[6, 5, 4],
			[3, 2, 1],
		]),
	);
	testLog('Matrix.equals (working)', result, true);

	result = mat2.equals(
		new Matrix([
			[9, 8, 7],
			[6, 5, 4],
			[3, 2, -1],
		]),
	);
	testLog('Matrix.equals (sensibility)', result, false);
}
