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
