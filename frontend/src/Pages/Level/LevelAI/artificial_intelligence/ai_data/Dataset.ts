import { Matrix, appendColumn, appendRow } from '../AIUtils';

/**
 * This class represents a Dataset as stored in the backend database.
 */
export class Dataset {

  private paramNames: string[];

  /**
   * Constructor of the class. It requires the sames parameters as the columns in the website's database.
   * @param id the id pof the dataset.
   * @param name the name of the dataset.
   * @param data the data inside the dataset, as an array of json objects.
   */
  constructor(
    private id: number, 
    private name: string,
    private data: any[]
  ) {
    this.paramNames = Object.keys(data[0]);
  }

  /**
   * Replace the parameter with the given name by other one-hot parameters.
   * A one-hot parameter is a boolean parameter indicating if the data had one of
   * its parameters equal to a specific value or not.
   * In order to replace a qualitative parameter, we have to create a new one-hot
   * parameter for each possible value of the original parameter.
   * 
   * @param param the parameter's name to replace.
   * @returns a boolean indicating if the replacement has been made.
   */
  public createOneHot(param: string): boolean {
    let iterator: number = 0;
    let posValues: string[] = [];

    // Check if the given name is a parameter in the database
    while(this.paramNames[iterator] !== param) {
      iterator++;
      // If no correspondance were found, end the function and print an error
      if (iterator === Object.keys(this.data[0]).length) {
        console.log("Error: key is not the name of any parameter.");
        return false;
      }
    }

    // Create all possible values for the parameter
    for (let dataNum: number = 0; dataNum < this.data.length; dataNum++) {
      if (!posValues.includes(this.data[dataNum][param])) {
        posValues.push(this.data[dataNum][param]);
      }
    }

    // Create a one-hot parameter for each possible value and remove the original parameter
    for (let dataNum: number = 0; dataNum < this.data.length; dataNum++) {
      for (let i: number = 0; i < posValues.length; i++) {
        this.data[dataNum][posValues[i]] = (this.data[dataNum][param] === posValues[i]) ? 1 : 0;
      }
      delete this.data[dataNum][param];
    }

    return true;
  }

  /**
   * Returns the dataset values into a 2D-array, where each row represents 
   * a parameter and each column represents a data.
   * Note that the datatypes of some parameters could be other than numbers,
   * thus making these parameters impossible to use in a ML algorithm.
   * @returns the dataset values in a 2D-array.
   */
  public getDataAsArray(): any[][] {
    const nbData: number = this.data.length;
    const nbParams: number = Object.keys(this.data[0]).length;
    const keys: string[] = Object.keys(this.data[0]);
    let dataArray: any[][] = [];
    let paramArray: any[];

    // Each row represents a parameter
    for (let row: number = 0; row < nbParams; row++) {
      paramArray = [];
      // Each column represents a data
      for (let col: number = 0; col < nbData; col++) {
        paramArray.push(this.data[col][keys[row]]);
      }
      dataArray.push(paramArray);
    }

    return dataArray;
  }

  /**
   * Returns the data as a Matrix object, where each row represents a parameter
   * and each column a data. 
   * The Matrix cannot accept strings, meaning that every string parameter should be converted
   * as numbers before calling this method.
   * @returns a Matrix representing the data.
   */
  public getDataAsMatrix(): Matrix {
    // Check if a parameter is still a string
    for (let dataNum: number = 0; dataNum < this.data.length; dataNum++) {
      for (let i: number = 0; i < Object.keys(this.data[0]).length; i++) {
        if (typeof(this.data[dataNum][Object.keys(this.data[0])[i]]) === "string") {
          console.log("Error: Matrix creation failed. Some values are not numbers in the dataset.");
          return new Matrix(1, 1);
        }
      }
    }

    // Create and return the Matrix by calling get
    return new Matrix(this.getDataAsArray());
  }

  /**
   * Creates and returns an array of Matrix objects based on the codes given as 
   * arguments. The returned array will contain the input Matrix and the output
   * Matrix, where each row represents a different parameter of the dataset.
   * @param IOCodes an array of codes assigned to each parameter that decides 
   * if a specific param is:
   * - an input (1), 
   * - an output (0) or 
   * - ignored (-1).
   * 
   * A code has to be assigned to each parameter, otherwise the method prints an error.
   * @returns an array of Matrices containing:
   * - at index 0: the input Matrix,
   * - at index 1: the output Matrix.
   * 
   * Returns an array with the data Matrix only if an error occured in the process.
   */
  public getInputsOutputs(IOCodes: number[]): Matrix[] {
    const dataMatrix: Matrix = this.getDataAsMatrix()
    let inputs: Matrix = new Matrix(1, 1);
    let outputs: Matrix = new Matrix(1, 1);
    let noInput: boolean = true;
    let noOutput: boolean = true;

    // Check if the Matrix creation failed
    if (dataMatrix.getRows() === 1 && dataMatrix.getColumns() === 1 && dataMatrix.sumOfAll() === 0) {
      console.log("Error: Matrix creation failed. Some values are not numbers in the dataset.");
      return [dataMatrix];
    }

    // Check if there is enough codes in the array
    if (IOCodes.length !== dataMatrix.getRows()) {
      console.log("Error: the inputs/outputs could not be created. The number of IOCodes is not the same as the number of parameters in the dataset.");
      return [dataMatrix];
    }

    for (let param: number = 0; param < IOCodes.length; param++) {
      switch(IOCodes[param]) {
        // If the selected param is an input
        case 1:
          if (noInput) {
            inputs = dataMatrix.getMatrixRow(param);
            noInput = false;
          } else {
            inputs = appendRow(inputs, dataMatrix.getMatrixRow(param));
          }
          break;

        // If the selected param is an output
        case 0:
          if (noOutput) {
            outputs = dataMatrix.getMatrixRow(param);
            noOutput = false;
          } else {
            outputs = appendRow(outputs, dataMatrix.getMatrixRow(param));
          }
          break;

        // If the selected param is not an input or an output
        case -1:
          break;

        // If the code is not valid
        default:
          console.log("Error in IOCodes: the code " + IOCodes[param] + " is not a valid code.");
      }
    }
    return [inputs, outputs];
  }

  /**
   * Returns the name of each parameter in the dataset as an array of strings.
   * @returns the parameters names.
   */
  public getParamNames(): string[] {
    return this.paramNames;
  }

  /**
   * Returns the name of the dataset.
   * @returns the dataset's name.
   */
  public getName(): string {
    return this.name;
  }
}
