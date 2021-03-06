/**
 * This interface defines the properties of a Data
 */
export interface DataSample {
	id: number;
	x: number;
	y: number;
}

/**
 * This class represents a mathematical matrix that can be used to perform
 * matrix operations such as matrix multiplications.
 */
export class Matrix {
	private readonly value: number[][];
	private rows: number;
	private columns: number;

	// --CONSTRUCTORS-- //
	/**
	 * Creates a Matrix full of zeros by specifying its number of rows and columns.
	 * @param rows the Matrix's number of rows.
	 * @param columns the Matrix's number of columns.
	 */
	public constructor(rows: number, columns: number);

	/**
	 * Creates a Matrix by specifying its value.
	 * @param value the value of the Matrix.
	 */
	public constructor(value: number[][]);

	public constructor(...args: any[]) {
		if (args.length === 2) this.value = zeros(args[0], args[1]);
		else if (args.length === 1) {
			if (typeof args[0][0] == 'undefined') this.value = [args[0]];
			else this.value = args[0];
		} else this.value = zeros(1, 1);

		this.rows = this.value.length;
		this.columns = this.value[0].length;
	}

	// --METHODS-- //

	/**
	 * Returns the sum of all elements in the Matrix.
	 * @returns the sum of all elements.
	 */
	public sumOfAll(): number {
		let sum: number = 0;
		for (let i: number = 0; i < this.rows; i++) {
			for (let j: number = 0; j < this.columns; j++) {
				sum += this.value[i][j];
			}
		}
		return sum;
	}

	/**
	 * Computes the sum of all elements in each row and place the results in a new
	 * Matrix of size (rows x 1) where each row contains one element, which is the
	 * computated sum of the same row in the Matrix. Returns the new Matrix when
	 * completed.
	 * @returns the Matrix representing the sum of each row.
	 */
	public sumOfAllRows(): Matrix {
		let newValues: number[][] = zeros(this.getRows(), 1);
		// Adding the sum of each row to the new Matrix
		for (let row: number = 0; row < this.getRows(); row++) {
			newValues[row][0] += this.getMatrixRow(row).sumOfAll();
		}
		return new Matrix(newValues);
	}

	/**
	 * Returns an array containing the mean of each row of this Matrix.
	 * @returns the array of means for each row.
	 */
	public meanOfAllRows(): number[] {
		return this.value.map((array: number[]): number => {
			return mean(array);
		});
	}

	/**
	 * Returns an array containing the standard deviation of each row of this Matrix.
	 * @returns the array of standard deviation for each row.
	 */
	public deviationOfAllRows(): number[] {
		return this.value.map((array: number[]): number => {
			return stdDev(array);
		});
	}

	/**
	 * Returns a new Matrix representing the transpose of this. The resluting Matrix
	 * will have a size of (this.getColumns() x this.getRows()).
	 * @returns a new Matrix being the transpose of this.
	 */
	public transpose(): Matrix {
		// Initializing the Matrix's first row with the first column of this
		let newMatrix: Matrix = new Matrix([
			this.getMatrixColumn(0).getValue().flat(),
		]);
		let temp: Matrix;

		// Adding the remaining rows
		for (let col: number = 1; col < this.getColumns(); col++) {
			temp = new Matrix([this.getMatrixColumn(col).getValue().flat()]);
			newMatrix = appendRow(newMatrix, temp);
		}

		return newMatrix;
	}

	/**
	 * Returns one row of the Matrix as a new Matrix (1 x columns).
	 * @param rowNumber the row number.
	 * @returns the row as a new Matrix.
	 */
	public getMatrixRow(rowNumber: number): Matrix {
		return new Matrix([this.value[rowNumber]]);
	}

	/**
	 * Returns one column of the Matrix as a new Matrix (row x 1).
	 * @param colNumber the column number.
	 * @returns the column as a new Matrix.
	 */
	public getMatrixColumn(colNumber: number): Matrix {
		let columnValues: number[][] = [];

		for (let i: number = 0; i < this.rows; i++) {
			columnValues.push([this.value[i][colNumber]]);
		}
		return new Matrix(columnValues);
	}

	/**
	 * Returns the 2D array representing the values of the matrix.
	 * @returns the Matrix's values.
	 */
	public getValue(): number[][] {
		return this.value;
	}

	/**
	 * Returns the number of rows.
	 * @returns the number of rows.
	 */
	public getRows(): number {
		return this.rows;
	}

	/**
	 * Returns the number of columns.
	 * @returns the number of columns.
	 */
	public getColumns(): number {
		return this.columns;
	}

	/**
	 * Asserts that the Matrix parameter is equal to the current Matrix. To be considered equal, 2
	 * Matrices must have the following points in common :
	 * - the same number of rows;
	 * - the same number of columns;
	 * - the same values at the same place inside the Matrix.
	 * @param otherMatrix the other Matrix to compare.
	 * @returns true if both Matrices are Equal, false otherwise.
	 */
	public equals(otherMatrix: Matrix): boolean {
		if (
			this.rows !== otherMatrix.getRows() ||
			this.columns !== otherMatrix.getColumns()
		)
			return false;

		const otherValue: number[][] = otherMatrix.getValue();
		for (let row: number = 0; row < this.rows; row++) {
			for (let col: number = 0; col < this.columns; col++) {
				if (this.value[row][col] !== otherValue[row][col]) return false;
			}
		}
		return true;
	}

	/**
	 * Asserts that the Matrix passed in parameter has the same size as this Matrix.
	 * Returns true if this is the case, false otherwise.
	 * @param otherMatrix the other Matrix to compare.
	 * @returns true if both sizes are the same, false otherwise.
	 */
	public sameSize(otherMatrix: Matrix): boolean {
		if (
			this.rows === otherMatrix.getRows() &&
			this.columns === otherMatrix.getColumns()
		)
			return true;
		return false;
	}

	public static add() {}

	/**
	 * Displays the Matrix on the application's console.
	 * @param cmd the console object.
	 */
	public displayInCmd(cmd: any) {
		let str: String;
		for (let row: number = 0; row < this.rows; row++) {
			str = '';
			for (let col: number = 0; col < this.columns; col++) {
				str = str + (Math.round(this.value[row][col] * 1000) / 1000).toString();
				if (col !== this.columns - 1) str = str + '   ';
			}
			cmd?.print('[' + str + ']');
		}
	}

	/**
	 * Displays the Matrix on the standart console.
	 */
	public display() {
		let str: String;
		for (let row: number = 0; row < this.rows; row++) {
			str = '';
			for (let col: number = 0; col < this.columns; col++) {
				str = str + (Math.round(this.value[row][col] * 1000) / 1000).toString();
				if (col !== this.columns - 1) str = str + '   ';
			}
			console.log('[' + str + ']');
		}
	}
}

/**
 * Creates and returns a 2D-array full of zeros. Its size is determined by the number
 * of columns and rows specified in parameters. If the number of rows or columns is 0,
 * then returns a 1/1 zero matrix.
 * @param rows the number rows, or number of elements of the 1st dimension.
 * @param columns the number of columns, or number of elements of the 2nd dimension.
 * @returns a 2D-array full of zeros.
 */
export function zeros(rows: number, columns: number): number[][] {
	let output: number[][] = [];

	//If the number of rows or columns is 0, then return a 1/1 zero matrix
	if (rows === 0 || columns === 0) return [[0]];

	for (let i = 0; i < rows; i++) {
		output.push([0]);
		for (let j = 1; j < columns; j++) {
			output[i].push(0);
		}
	}

	return output;
}

/**
 * Returns a new Matrix in which a constant value is added to each element.
 * @param mat the Matrix in which to add a constant.
 * @param constant the constant to add.
 * @returns the resulting Matrix from this operation.
 */
export function matAddConstant(mat: Matrix, constant: number): Matrix {
	let output: number[][] = mat.getValue();

	return new Matrix(output.map(rowEl => rowEl.map(colEl => colEl + constant)));
}

/**
 * Computes the addition of 2 Matrices in 2 different ways :
 * - if the sizes of both Matrices are equal, performs an element-wise addition.
 * - if the number of rows are equal, but the number of columns of the second Matrix is 1,
 *   the second Matrix is added to each column of the first Matrix.
 * - in every other case, returns the first Matrix (the operation can't be done).
 *
 * @param mat1 the first Matrix, which its size determines the result's size.
 * @param mat2 the second Matrix, which has to be either :
 * - the same size as the first Matrix
 * - the same number of rows as the first Matrix and 1 column.
 * @returns the resulting Matrix of the addition. Its size is the same as the mat1 size.
 * If the sizes are not compatible, returns an error.
 */
export function matAdd(mat1: Matrix, mat2: Matrix): Matrix {
	let array1: number[][] = mat1.getValue();
	let array2: number[][] = mat2.getValue();

	// Error management
	if (
		mat1.getRows() !== mat2.getRows() ||
		(mat1.getColumns() !== mat2.getColumns() && mat2.getColumns() !== 1)
	) {
		console.log(
			'Erreur : les tailles ne sont pas compatibles pour une addition de matrices',
		);
		throw new Error(
			'Erreur : les tailles ne sont pas compatibles pour une addition de matrices',
		);
	}

	//Addition computation
	return new Matrix(
		array1.map((row, rowIdx) =>
			row.map((col, colIdx) => {
				// For a normal addition
				if (mat1.getColumns() === mat2.getColumns()) {
					return col + array2[rowIdx][colIdx];
				}
				// If mat2 is a column Matrix
				return col + array2[rowIdx][0];
			}),
		),
	);
}

/**
 * Computes the subtraction of 2 Matrices in 2 different ways :
 * - if the sizes of both Matrices are equal, performs an element-wise addition.
 * - if the number of rows are equal, but the number of columns of the second Matrix is 1,
 *   the second Matrix is subtracted to each column of the first Matrix.
 * - in every other case, returns the first Matrix (the operation can't be done).
 *
 * @param mat1 the first Matrix, which its size determines the result's size.
 * @param mat2 the second Matrix, which has to be either :
 * - the same size as the first Matrix
 * - the same number of rows as the first Matrix and 1 column.
 * @returns the resulting Matrix of the subtraction. Its size is the same as the mat1 size.
 */
export function matSubtract(mat1: Matrix, mat2: Matrix): Matrix {
	return matAdd(mat1, matMulConstant(mat2, -1));
}

/**
 * Computes the multiplication of a Matrix by a constant number and returns a
 * new Matrix containing the result.
 * @param mat the Matrix to multiply.
 * @param constant the constant that will multiply the Matrix.
 * @returns a new Matrix containing the result of the multiplication.
 */
export function matMulConstant(mat: Matrix, constant: number): Matrix {
	let output: number[][] = mat.getValue();

	const result: number[][] = output.map((value: number[]): number[] => {
		return value.map((value: number): number => {
			return value * constant;
		});
	});
	return new Matrix(result);
}

/**
 * Computes the element-wise multiplication of two Matrices and returns the
 * result in a new Matrix. Both matrices have to be of the same size.
 * @param mat1 the Matrix that will be multiplied.
 * @param mat2 the Matrix that will multiply the first one.
 * @returns the resulting Matrix from the element-wise multiplication. If both Matrices are not of
 * the same size, returns an error.
 */
export function matMulElementWise(mat1: Matrix, mat2: Matrix): Matrix {
	if (
		mat1.getRows() !== mat2.getRows() ||
		mat1.getColumns() !== mat2.getColumns()
	) {
		console.log(
			"Erreur Matrices: la taille des matrices n'est pas compatible pour une mutliplication par ??l??ment.",
		);
		throw new Error(
			"Erreur Matrices: la taille des matrices n'est pas compatible pour une mutliplication par ??l??ment.",
		);
	}
	let output: number[][] = mat1.getValue();
	const values2: number[][] = mat2.getValue();

	const result: number[][] = output.map(
		(value: number[], row: number): number[] => {
			return value.map((value: number, col: number): number => {
				return value * values2[row][col];
			});
		},
	);
	return new Matrix(result);
}

/**
 * Computes the element-wise division of two Matrices and returns the
 * result in a new Matrix. Both matrices have to be of the same size.
 * WARNING : if a division by zero occurs in the function, the result will
 * be replaced by 0.
 * @param mat1 the Matrix that will be divided.
 * @param mat2 the Matrix that will divide the first one
 * @returns the resulting Matrix from the element-wise division. If both Matrices are not of
 * the same size, returns an error.
 */
export function matDivElementWise(mat1: Matrix, mat2: Matrix): Matrix {
	if (
		mat1.getRows() !== mat2.getRows() ||
		mat1.getColumns() !== mat2.getColumns()
	) {
		console.log(
			"Erreur Matrices : la taille des matrices n'est pas compatible pour une division par ??l??ment.",
		);
		throw new Error(
			"Erreur Matrices : la taille des matrices n'est pas compatible pour une division par ??l??ment.",
		);
	}
	let output: number[][] = mat1.getValue();
	const values2: number[][] = mat2.getValue();

	const result: number[][] = output.map(
		(value: number[], row: number): number[] => {
			return value.map((value: number, col: number): number => {
				return values2[row][col] === 0 ? 0 : value / values2[row][col];
			});
		},
	);
	return new Matrix(result);
}

/**
 * Raises every element of a Matrix to the power specified in arguments and
 * returns a new Matrix with the new values.
 * @param mat the Matrix from which to raise to a power
 * @param pow the exponent value applied to each element.
 * @returns the new calculated Matrix.
 */
export function matPowElementWise(mat: Matrix, pow: number): Matrix {
	let values: number[][] = mat.getValue();

	for (let i: number = 0; i < values.length; i++) {
		for (let j: number = 0; j < values[0].length; j++) {
			values[i][j] = Math.pow(values[i][j], pow);
		}
	}
	return new Matrix(values);
}

/**
 * Computes the matrix multiplicaiton of 2 matrices and returns a new resulting
 * matrix.
 *
 * The number of columns of the first matrix has to match the number of
 * rows of the second matrix (example a (2, 3) with a (3, 4) would work but not
 * a (3, 2) with a (4, 3)). Otherwise the computation can't be solved and
 * returns a matrix full of zeros.
 *
 * @param m1 the first matrix.
 * @param m2 the second matrix.
 * @returns the result of the computation. The new matrix will have the same number
 * of rows as the first matrix and the same number of columns as the second matrix??
 *
 * If the number of columns of the first matrix doesn't match the number of rows
 * of the second matrix, returns an error.
 */
export function matMul(m1: Matrix, m2: Matrix): Matrix {
	//If the number of m1 columns doesn't equal the number of m2 rows, the equation
	//can't be solved, return a Matrix full of zeros.
	if (m1.getColumns() !== m2.getRows()) {
		console.log(
			"Erreur Matrices : la taille des matrices n'est pas compatible pour une multiplication matricielle.",
		);
		throw new Error(
			"Erreur Matrices : la taille des matrices n'est pas compatible pour une multiplication matricielle.",
		);
	}

	const value1: number[][] = m1.getValue();
	const value2: number[][] = m2.getValue();
	let outputValue: number[][] = zeros(m1.getRows(), m2.getColumns());

	// Computation of a matrix mulltiplication
	/*
	for (let row: number = 0; row < m1.getRows(); row++) {
		for (let col: number = 0; col < m2.getColumns(); col++) {
			for (let i: number = 0; i < m1.getColumns(); i++) {
				outputValue[row][col] += value1[row][i] * value2[i][col];
			}
		}
	}
	*/
	return new Matrix(
		outputValue.map((row, rowNum) =>
			row.map((el, colNum) => {
				let result: number = 0;
				for (let i: number = 0; i < m1.getColumns(); i++) {
					result += value1[rowNum][i] * value2[i][colNum];
				}
				return result;
			}),
		),
	);
}

/**
 * Computes the absolute value of all elements in a Matrix and returns them
 * into a new Matrix.
 * @param mat the Matrix to compute the absolute value.
 * @returns a new Matrix with absolute values only.
 */
export function matAbs(mat: Matrix): Matrix {
	let output: number[][] = mat.getValue();

	const result: number[][] = output.map((value: number[]): number[] => {
		return value.map((value: number): number => {
			return Math.abs(value);
		});
	});
	return new Matrix(result);
}

/**
 * Apprends the second Matrix's rows at the end of the first Matrix's rows.
 * The two Matrices have to contain the same number of columns, otherwise it's
 * impossible to append those Matrices.
 *
 * @param m1 the Matrix to which we will append the other Matrix.
 * @param m2 the Matrix which will be appended to the first Matrix.
 * @returns the resulting Matrix. If the 2 Matrices do not have the same number
 * of rows, returns an error.
 */
export function appendRow(m1: Matrix, m2: Matrix): Matrix {
	let outputValue: number[][] = m1.getValue();
	const m2Value: number[][] = m2.getValue();

	if (m1.getColumns() !== m2.getColumns()) {
		console.log(
			'Error in appendRow(): Matrices do not have the same number of columns.',
		);
		return new Matrix(outputValue);
	}

	for (let row: number = 0; row < m2.getRows(); row++) {
		outputValue.push(m2Value[row]);
	}

	return new Matrix(outputValue);
}

/**
 * Apprends the second Matrix's columns at the end of the first Matrix's columns.
 * The two Matrices have to contain the same number of rows, otherwise it's
 * impossible to append those Matrices.
 *
 * @param m1 the Matrix to which we will append the other Matrix.
 * @param m2 the Matrix which will be appended to the first Matrix.
 * @returns the resulting Matrix. If the 2 Matrices do not have the same number
 * of columns, returns an error.
 */
export function appendColumn(m1: Matrix, m2: Matrix): Matrix {
	let outputValue: number[][] = m1.getValue();
	const m2Value: number[][] = m2.getValue();

	if (m1.getRows() !== m2.getRows()) {
		console.log(
			'Error in appendColumn(): Matrices do not have the same number of rows.',
		);
		return new Matrix(outputValue);
	}

	for (let i: number = 0; i < outputValue.length; i++) {
		outputValue[i].push(...m2Value[i]);
	}

	return new Matrix(outputValue);
}

/**
 * Generates a random number using Box-Muller transform, allowing to
 * create a normal distribution by generating multiple samples.
 * @return the generated number.
 */
function randnBoxMuller(): number {
	let u: number = 0;
	let v: number = 0;
	while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
	while (v === 0) v = Math.random();
	return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Returns a Matrix with random values.
 * @param rows the number of rows for the output Matrix.
 * @param columns the number of columns for the output Matrix.
 * @returns the Matrix with random values.
 */
export function randomMatrix(rows: number, columns: number): Matrix {
	let randomValues: number[][] = zeros(rows, columns);

	for (let i: number = 0; i < rows; i++) {
		for (let j: number = 0; j < columns; j++) {
			randomValues[i][j] = Math.random();
		}
	}
	return new Matrix(randomValues);
}

/**
 * Returns the sum of an array of numbers.
 * @param data the array of numbers.
 * @returns the sum.
 */
export function sum(data: number[]): number {
	return data.reduce((prev: number, current: number): number => {
		return prev + current;
	});
}

/**
 * Returns the mean of an array of numbers.
 * @param data the array of numbers.
 * @returns the mean.
 */
export function mean(data: number[]): number {
	const result: number = sum(data);
	return result / data.length;
}

/**
 * Returns the standard deviation of an array of numbers.
 * @param data the array of numbers.
 * @returns the standard deviation.
 */
export function stdDev(data: number[]): number {
	const dataMean: number = mean(data);
	const summation: number = data.reduce(
		(prev: number, current: number): number => {
			return prev + Math.pow(current - dataMean, 2);
		},
	);
	return Math.sqrt(summation / data.length);
}

export function correlationCoeff(x: number[], y: number[]): number {
	let n: number = 0;

	if (x.length === 0 || y.length === 0) {
		throw new Error('Erreur : pas de valeur dans une des listes.');
	}

	if (x.length !== y.length) {
		throw new Error("Erreur : les deux listes n'ont pas la m??me longueur.");
	} else n = x.length;

	let xy: number[] = [];
	let x2: number[] = [];
	let y2: number[] = [];
	for (let i: number = 0; i < n; i++) {
		xy.push(x[i] * y[i]);
		x2.push(x[i] * x[i]);
		y2.push(y[i] * y[i]);
	}

	let numerator: number = n * sum(xy) - sum(x) * sum(y);
	let denominator: number =
		(n * sum(x2) - Math.pow(sum(x), 2)) * (n * sum(y2) - Math.pow(sum(y), 2));

	if (denominator === 0) return sum(x) === sum(y) ? 1 : 0;

	return numerator / Math.sqrt(denominator);
}

export function determinationCoeff(x: number[], y: number[]): number {
	return Math.pow(correlationCoeff(x, y), 2);
}
