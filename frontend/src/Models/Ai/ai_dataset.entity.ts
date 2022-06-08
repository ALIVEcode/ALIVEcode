import { Type } from 'class-transformer';
import {
	appendRow,
	Matrix,
	mean,
	stdDev,
} from '../../Pages/Challenge/ChallengeAI/artificial_intelligence/AIUtils';

/**
 * This class represents a AIDataset as stored in the backend database.
 */
export class AIDataset {
	private _paramNames?: string[];
	public id: string;
	private name: string;
	private data: any[];
	private initialData: any[];
	private means: number[];
	private deviations: number[];

	@Type(() => Date)
	private creationDate: Date;

	@Type(() => Date)
	private updateDate: Date;

	get paramNames() {
		if (!this._paramNames) this._paramNames = this.loadParamNames();
		return this._paramNames;
	}

	/**
	 * Constructor of the class. It requires the sames parameters as the columns in the website's database.
	 * @param id the id pof the dataset.
	 * @param name the name of the dataset.
	 * @param data the data inside the dataset, as an array of json objects.
	 */
	constructor(id: string, name: string, data: any[]) {
		this.id = id;
		this.name = name;
		this.initialData = data;
		this.data = data;
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
		while (this.paramNames[iterator] !== param) {
			iterator++;
			// If no correspondance were found, end the function and print an error
			if (iterator === Object.keys(this.data[0]).length) {
				console.log('Error: key is not the name of any parameter.');
				return false;
			}
		}

		if (typeof this.data[0][param] != 'string') return false;

		// Create all possible values for the parameter
		for (let dataNum: number = 0; dataNum < this.data.length; dataNum++) {
			if (!posValues.includes(this.data[dataNum][param])) {
				posValues.push(this.data[dataNum][param]);
			}
		}

		// Create a one-hot parameter for each possible value and remove the original parameter
		for (let dataNum: number = 0; dataNum < this.data.length; dataNum++) {
			for (let i: number = 0; i < posValues.length; i++) {
				this.data[dataNum][posValues[i]] =
					this.data[dataNum][param] === posValues[i] ? 1 : 0;
				//this.paramNames[i] = param
			}
			delete this.data[dataNum][param];
		}

		//Remove the parameter to replace of the array of parameters
		this.paramNames.forEach((value, index) => {
			if (value == param) this.paramNames.splice(index, 1);
		});

		//Addind the new prarameter to the array of parameters
		posValues.forEach(e => {
			this.paramNames.splice(iterator, 0, e);
			iterator++;
		});

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
		const nbParams: number = this.paramNames.length;
		let dataArray: any[][] = [];
		let paramArray: any[];

		// Each row represents a parameter
		for (let row: number = 0; row < nbParams; row++) {
			paramArray = [];
			// Each column represents a data
			for (let col: number = 0; col < nbData; col++) {
				paramArray.push(this.data[col][this.paramNames[row]]);
			}
			dataArray.push(paramArray);
		}

		return dataArray;
	}

	/**
	 * Returns a 2-D array containing all data from this AIDataset with its
	 * original values.
	 * @returns a 2-D array with data from this AIDataset.
	 */
	public getDataForTable(): any[][] {
		const nbData: number = this.data.length;
		const nbParams: number = this.paramNames.length;
		let dataArray: any[][] = [];
		let dataLine: any[];

		// Each row represents a data
		for (let row: number = 0; row < nbData; row++) {
			dataLine = [];
			// Each column represents a parameter
			for (let col: number = 0; col < nbParams; col++) {
				dataLine.push(this.data[row][this.paramNames[col]]);
			}
			dataArray.push(dataLine);
		}
		return dataArray;
	}

	/**
	 * Returns the data as a Matrix object, where each row represents a parameter
	 * and each column a data.
	 *
	 * The Matrix cannot accept strings, meaning that every string parameter should be converted
	 * as numbers before calling this method.
	 * @returns a Matrix representing the data.
	 */
	public getDataAsMatrix(): Matrix {
		// Check if a parameter is still a string
		for (let dataNum: number = 0; dataNum < this.data.length; dataNum++) {
			for (let i: number = 0; i < this.paramNames.length; i++) {
				if (typeof this.data[dataNum][this.paramNames[i]] === 'string') {
					console.log(
						'Error: Matrix creation failed. Some values are not numbers in the dataset.',
					);
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
		const dataMatrix: Matrix = this.getDataAsMatrix();
		let inputs: Matrix = new Matrix(1, 1);
		let outputs: Matrix = new Matrix(1, 1);
		let noInput: boolean = true;
		let noOutput: boolean = true;

		// Check if the Matrix creation failed
		if (
			dataMatrix.getRows() === 1 &&
			dataMatrix.getColumns() === 1 &&
			dataMatrix.sumOfAll() === 0
		) {
			console.log(
				'Error: Matrix creation failed. Some values are not numbers in the dataset.',
			);
			return [dataMatrix];
		}

		// Check if there is enough codes in the array
		if (IOCodes.length !== dataMatrix.getRows()) {
			console.log(
				'Error: the inputs/outputs could not be created. The number of IOCodes is not the same as the number of parameters in the dataset.',
			);
			return [dataMatrix];
		}

		for (let param: number = 0; param < IOCodes.length; param++) {
			switch (IOCodes[param]) {
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
					console.log(
						'Error in IOCodes: the code ' +
							IOCodes[param] +
							' is not a valid code.',
					);
			}
		}

		return [inputs, outputs];
	}

	/**
	 * Sets the means and deviations for each parameter in the dataset.
	 */
	public setMeansAndDeviations(): void {
		const dataArray: number[][] = this.getDataAsArray();
		this.means = [];
		this.deviations = [];
		for (let param: number = 0; param < dataArray.length; param++) {
			this.means.push(mean(dataArray[param]));
			this.deviations.push(stdDev(dataArray[param]));
		}
	}

	/**
	 * Sets the param names for this AIDataset. If there is no data yet, sets
	 * the property to an empty array.
	 * @returns the paramNames property.
	 */
	public loadParamNames() {
		if (!this.data || !Array.isArray(this.data) || this.data.length < 1) {
			this._paramNames = [];
			return this._paramNames;
		}
		this._paramNames = Object.keys(this.data[0]);
		return this._paramNames;
	}

	/**
	 * Normalizes a data by subtracting the mean and dividing
	 * by the standard deviation. This function is meant to be used
	 * for a data that is going to be passed as an input but was not part
	 * of the original Dataset.
	 * @param data the data to normalize.
	 * @param mean the mean of the parameter related to this data.
	 * @param deviation the standard deviation of the parameter related to this data.
	 * @returns the normalized data.
	 */
	public normalize(data: number, mean: number, deviation: number): number {
		return (data - mean) / deviation;
	}

	/**
	 * Normalizes an array of numbers by subtracting the mean and dividing
	 * by the standard deviation for each data of the given array. The resulting
	 * array will contain values near zero.
	 * @param data the array to normalize.
	 * @param mean the mean of the parameter in the original Dataset.
	 * @param deviation the standard deviation of the parameter in the original Dataset.
	 * @returns a new array with normalized data.
	 */
	public normalizeArray(
		data: number[],
		mean: number,
		deviation: number,
	): number[] {
		return data.copyWithin(0, 0).map((value: number): number => {
			return this.normalize(value, mean, deviation);
		});
	}

	/**
	 * Normalizes a parameter of this dataset, then replace the parameter's values
	 * with the normalized ones. Cannot normalize of the param name is unknown or
	 * the param defines a string value.
	 * @param paramName the name of the parameter to normalize.
	 * @returns a boolean indicating if the normalization could have been done.
	 */
	public normalizeParam(paramName: string): boolean {
		let iterator: number = 0;

		// Check if the given name is a parameter in the database
		while (this.paramNames[iterator] !== paramName) {
			iterator++;
			// If no correspondance were found, end the function and print an error
			if (iterator === Object.keys(this.data[0]).length) {
				console.log('Error: key is not the name of any parameter.');
				return false;
			}
		}

		if (typeof this.data[0][paramName] === 'string') {
			console.log('Error: string data is not normalizable.');
			return false;
		}

		// Setting means and deviations for each parameter
		if (!this.means || !this.deviations) this.setMeansAndDeviations();
		if (!this._paramNames) this.loadParamNames();

		const index: number = this._paramNames!.indexOf(paramName);

		const newData: number[] = this.normalizeArray(
			this.getDataAsArray()[index],
			this.means[index],
			this.deviations[index],
		);

		this.replaceColumn(paramName, newData);
		return true;
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

	/**
	 * Returns the array of means for this dataset.
	 * @returns the array of means.
	 */
	public getMeans(): number[] {
		return this.means;
	}

	/**
	 * Returns the array of standard deviations for this dataset.
	 * @returns the array of deviations.
	 */
	public getDeviations(): number[] {
		return this.deviations;
	}

	/**
	 * This function clones this classe object
	 * @returns the clone
	 */
	public clone() {
		//Clone the data
		let dataClone: any[] = [];
		this.data!.forEach(val => dataClone.push(Object.assign({}, val)));

		//Clone the aparamNames
		let paramNamesClone: any[] = [];
		this.paramNames!.forEach(val =>
			paramNamesClone.push(Object.assign({}, val)),
		);

		//Clone the object
		let clone = new AIDataset(this.id, this.name, dataClone);
		console.log('CLONE : ', clone);
		clone.loadParamNames();
		return clone;
	}

	/**
	 * Replace the data of a parameter
	 * @param param the parameter's name to replace.
	 * @param data Elements to replace
	 * @returns a boolean indicating if the replacement has been made.
	 */
	public replaceColumn(param: string, data: any[]): boolean {
		let iterator: number = 0;
		// Check if the given name is a parameter in the database
		while (this.paramNames[iterator] !== param) {
			iterator++;
			// If no correspondance were found, end the function and print an error
			if (iterator === Object.keys(this.data[0]).length) {
				console.log('Error: key is not the name of any parameter.');
				return false;
			}
		}
		//Change the data of the parameter
		if (typeof this.data[0][param] == 'string') return false;
		for (let dataNum: number = 0; dataNum < this.data.length; dataNum++) {
			this.data[dataNum][param] = data[dataNum];
		}
		return true;
	}
}
