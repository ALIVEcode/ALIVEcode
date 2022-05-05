import { Model } from './Model';
import {
	MODEL_TYPES,
	RegHyperparameters,
	REGRESSION_TYPES,
} from '../AIEnumsInterfaces';
import DataTypes from '../../../../../Components/ChallengeComponents/ChallengeGraph/DataTypes';

export abstract class Regression extends Model {
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

	constructor(id: number, hyperparams: RegHyperparameters) {
		super(id, MODEL_TYPES.Regression);

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
}
