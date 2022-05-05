import DataTypes from '../../../../../Components/ChallengeComponents/ChallengeGraph/DataTypes';
import {
	MODEL_TYPES,
	REGRESSION_TYPES,
} from '../../../../../Models/Ai/ai_model.entity';
import { RegHyperparameters } from '../AIEnumsInterfaces';
import { Matrix } from '../AIUtils';
import AIModel from '../../../../../Models/Ai/ai_model.entity';

export abstract class Regression extends AIModel {
	protected static NB_PARAMS_POLY = 4;
	protected static ROUNDING = 1000;
	protected static DATA_FORMATTING: DataTypes = {
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
	protected hyperparams: RegHyperparameters;

	constructor(id: number, hyperparams: RegHyperparameters) {
		super(id, MODEL_TYPES.POLY_REGRESSION);
		this.hyperparams = hyperparams;

		switch (hyperparams.model.RegressionType) {
			case REGRESSION_TYPES.Polynomial:
				this.nbParams = 4;
				break;

			default:
				console.log(
					'Error: Regression type is invalid while creating the regression.',
				);
				this.nbParams = 0;
		}
	}

	/**
	 * Generates an object with formatting settings and an array of points that can be used to be plotted on a graph.
	 * @returns an object with formatting settings and an array of points
	 */
	public abstract generatePoints(): DataTypes;

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

	public abstract predict(inputs: Matrix): Matrix;

	public abstract predictOne(input: number): number;
}
