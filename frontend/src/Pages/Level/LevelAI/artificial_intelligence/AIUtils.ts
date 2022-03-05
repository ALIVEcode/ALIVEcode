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

  private value: number[][];
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
    if (args.length === 2) {
      this.value = zeros(args[0], args[1]);
    }
    else if (args.length === 1) this.value = args[0];
    else this.value = zeros(1, 1);

    this.rows = this.value.length;
    this.columns = this.value[0].length;
  }

  // --METHODS-- //
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
   * Sets the value of the Matrix and adjusts the number of rows and columns.
   * @param newValue the new value of the Matrix.
   */
  public setValue(newValue: number[][]) {
    this.value = newValue;
    this.rows = newValue.length;
    this.columns = newValue[0].length;
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
 * of rows as the first matrix and the same number of columns as the second matrixé
 * 
 * If the number of columns of the first matrix doesn't match the number of rows 
 * of the second matrix, returns a matrix full of zeros (same size as if the equation could have been solved).
 */
export function matMul(m1: Matrix, m2: Matrix): Matrix {
  
  //If the number of m1 columns doesn't equal the number of m2 rows, the equation 
  //can't be solved, return a Matrix full of zeros.
  if (m1.getColumns() !== m2.getRows()) {
    return new Matrix(zeros(m1.getRows(), m2.getColumns()))
  }
  
  const value1: number[][] = m1.getValue();
  const value2: number[][] = m2.getValue();
  let outputValue: number[][] = zeros(m1.getRows(), m2.getColumns());

  // Computation of a matrix mulltiplication
  for (let row: number = 0; row < m1.getRows(); row++) {
    for (let col: number = 0; col < m2.getColumns(); col++) {
      for (let i: number = 0; i < m1.getColumns(); i++) {
        outputValue[row][col] += value1[row][i] * value2[i][col];
      }
    }
  }

  return new Matrix(outputValue);
}

/**
 * Apprends the second Matrix's columns at the end of the first Matrix's columns.
 * The two Matrices have to contain the same number of rows, otherwise it's 
 * impossible to append those Matrices.
 * 
 * @param m1 the Matrix to which will be appended the other Matrix.
 * @param m2 the Matrix which will be appended to the first Matrix.
 * @returns the resulting Matrix. If the 2 Matrices do not have the same number 
 * of rows, returns a copy of the first Matrix.
 */
export function appendColumn(m1: Matrix, m2: Matrix): Matrix {
  let outputValue: number[][] = m1.getValue();
  const m2Value: number[][] = m2.getValue();
  
  if (m1.getRows() !== m2.getRows()) return new Matrix(outputValue);

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
  let u: number = 0 
  let v: number = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

/**
 * Returns a Matrix with values generated from a normal distribution with mean of 0
 * and standart deviation 1.
 * @param rows the number of rows for the output Matrix.
 * @param columns the number of columns for the output Matrix.
 * @returns the Matrix with random values.
 */
export function normalMatrix(rows: number, columns: number): Matrix {
  let randomValues: number[][] = zeros(rows, columns);

  for (let i: number = 0; i < rows; i++) {
    for (let j: number = 0; j < columns; j++) {
      randomValues[i][j] = randnBoxMuller();
    }
  }

  return new Matrix(randomValues);
}
