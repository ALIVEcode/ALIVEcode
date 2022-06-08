import DataPoint from '../../../../../../Components/ChallengeComponents/ChallengeGraph/DataTypes';
import { MODEL_TYPES } from '../../../../../../Models/Ai/ai_model.entity';
import { RegHyperparameters, RegModelParams } from '../../AIUtilsInterfaces';
import { Matrix } from '../../AIUtils';
import AIModel from '../../../../../../Models/Ai/ai_model.entity';

/**
 * This abstract class represents every Regression Model available in AI challenges.
 * It contains core properties and methods common to all AI Regression Models, and every
 * new class representing a specific type of regression model should extend from this class.
 */
export abstract class Regression extends AIModel {
	protected static ROUNDING = 1000;
	protected static DATA_FORMATTING: DataPoint = {
		type: 'line',
		label: 'Fonction polynomiale',
		data: [{}],
		borderColor: 'rgb(33, 87, 145)',
		borderWidth: 3,
		pointRadius: 3,
		pointBorderWidth: 0,
		pointBackgroundColor: 'black',
	};
	protected static NB_POINTS = 20;
	protected static MIN_RANGE = 0;
	protected static MAX_RANGE = 100;

	protected nbParams: number;
	protected hyperparameters: RegHyperparameters;
	protected modelParams: RegModelParams;
	protected outputMean: number;
	protected outputDeviation: number;

	/**
	 * Constructor of a Regression. Initializes all properties and decides if
	 * the Regression is loaded from the database or created from scratch.
	 * @param id the identifier of the model.
	 * @param hyperparams the hyperparameters object of the Regression.
	 * @param modelParams the model parameters of this Regression. It can be undefined if
	 * the Regression doesn't come from the database.
	 */
	constructor(
		id: string | null,
		hyperparams: RegHyperparameters,
		modelType: MODEL_TYPES,
		nbParams: number,
	) {
		super(id, modelType);
		this.hyperparameters = hyperparams;

		if (nbParams !== hyperparams.modelParams.params.length) {
			throw new Error(
				'Error: could not create the Regression Model. There are ' +
					hyperparams.modelParams.params.length +
					' when there should be ' +
					nbParams,
			);
		}
	}

	/**
	 * Normalizes the output Matrix by applying the normalize() function to the row
	 * containing the output.
	 * @param outputs the output Matrix to normalize.
	 * @returns a new Matrix with normalized values with respect to their row.
	 */
	public normalizeOutputByRow(outputs: Matrix): Matrix {
		const baseOutputs: number[][] = outputs.getValue();
		let normalized: number[][] = [];

		// Check if there is enough means and deviations in the arrays.
		if (
			outputs.getRows() > this.inputMeans.length ||
			outputs.getRows() > this.inputDeviations.length
		) {
			throw new Error(
				'Error: could not normalize data. Some means or deviations were missing.',
			);
		}

		for (let row: number = 0; row < outputs.getRows(); row++) {
			normalized.push(
				this.normalizeArray(
					baseOutputs[row],
					this.outputMean,
					this.outputDeviation,
				),
			);
		}
		return new Matrix(normalized);
	}

	public predict(inputs: Matrix): Matrix {
		if (inputs.getRows() !== 1) {
			throw new Error(
				'Error: too many parameters entered for a regression model.',
			);
		}
		const outputs: number[] = inputs
			.getValue()[0]
			.map((value: number, index: number): number => {
				return this.predictOne(value);
			});

		return new Matrix([outputs]);
	}

	public setNormalization(
		inputMeans: number[],
		inputDeviations: number[],
		outputMean?: number | undefined,
		outputDeviation?: number | undefined,
	): void {
		this.inputMeans = inputMeans;
		this.inputDeviations = inputDeviations;
		if (!outputMean || !outputDeviation) {
			throw new Error(
				'Error: missing arguments for setting normalization for a regression.',
			);
		}
		this.outputMean = outputMean;
		this.outputDeviation = outputDeviation;
	}

	/**
	 * Generates an object with formatting settings and an array of points that can be used to be plotted on a graph.
	 * @returns an object with formatting settings and an array of points
	 */
	public abstract generatePoints(): DataPoint;

	/**
	 * Returns a copy of the existing Regression.
	 * @returns a copy of the Regression object.
	 */
	public abstract copy(): Regression;

	/**
	 * Sets all parameters of the Regression at the same time.
	 * @param newParams the array of new parameters. If the number of
	 * elements in this array is not the same as the number of parameters
	 * in this Regression, all parameters stay the same.
	 */
	public abstract setParams(newParams: number[]): void;

	/**
	 * Returns a string describing the value of each parameter in the
	 * Regression Object.
	 */
	public abstract paramsToString(): string;

	/**
	 * Returns the rounding factor of the class.
	 * @returns the rounding factor.
	 */
	public static getRounding() {
		return Regression.ROUNDING;
	}

	/**
	 * Returns the hyperparameters object from this model.
	 * @returns the hyperparameters object
	 */
	public getHyperparameters() {
		return this.hyperparameters;
	}

	/**
	 * Computes the output of the Regression for one input and returns this output.
	 * @param input the input value from witch to compute the output.
	 * @return the computed output.
	 */
	public abstract predictOne(input: number): number;

	/*
		The 2 following methods are useless for Regression models, because
		their model parameters are directly set by the user, witch removes 
		the need of having to separate the loading versus the creation.
	*/
	public loadModel(): void {}
	public createModel(): void {}
}
