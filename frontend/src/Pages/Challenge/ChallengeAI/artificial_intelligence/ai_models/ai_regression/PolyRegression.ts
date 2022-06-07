import { RegHyperparameters, RegModelParams } from '../../AIUtilsInterfaces';
import { Regression } from './Regression';
import DataPoint from '../../../../../../Components/ChallengeComponents/ChallengeGraph/DataTypes';
import { MODEL_TYPES } from '../../../../../../Models/Ai/ai_model.entity';

/**
 * This class defines a third degree polynomial function that can be shown in a scatter plot of a line graph.
 *
 * The equation of a polynomial function is described as this :
 * f(x) = a*x^3 + b*x^2 + c*x + d
 * where a, b, c and d are the 4 parameters of the function.
 *
 * It also contains methods to optimize the function with another dataset.
 *
 * @author Félix Jobin
 */
export class PolyRegression extends Regression {
	protected static NB_PARAMS = 4;

	private a: number;
	private b: number;
	private c: number;
	private d: number;

	constructor(id: string | null, hyperparams: RegHyperparameters) {
		super(
			id,
			hyperparams,
			hyperparams.modelParams,
			MODEL_TYPES.POLY_REGRESSION,
			PolyRegression.NB_PARAMS,
		);
		this.setParams(hyperparams.modelParams.params);
	}

	public generatePoints(): DataPoint {
		let points = [];
		// Generate points
		const jump =
			(Regression.MAX_RANGE - Regression.MIN_RANGE) / Regression.NB_POINTS;
		for (let i = 0; i < Regression.NB_POINTS; i++) {
			const x = Regression.MIN_RANGE + i * jump;
			const y = this.a * Math.pow(x, 3) + this.b * x * x + this.c * x + this.d;
			points.push({
				id: i * this.a * this.b * this.c * this.d * jump,
				x: x,
				y: Math.round(y * Regression.ROUNDING) / Regression.ROUNDING,
			});
		}
		const data: DataPoint = Regression.DATA_FORMATTING;
		data.data = points;
		return data;
	}

	public copy(): PolyRegression {
		let hyperparams: RegHyperparameters = {
			modelParams: {
				params: [this.a, this.b, this.c, this.d],
			},
			costFunction: this.hyperparameters.costFunction,
			learningRate: this.hyperparameters.learningRate,
			epochs: this.hyperparameters.epochs,
		};
		return new PolyRegression(this.id, hyperparams);
	}

	/**
	 * Returns the a parameter of the Regression.
	 * @returns the a parameter.
	 */
	public getA(): number {
		return this.a;
	}

	/**
	 * Returns the b parameter of the Regression.
	 * @returns the b parameter.
	 */
	public getB(): number {
		return this.b;
	}

	/**
	 * Returns the c parameter of the Regression.
	 * @returns the c parameter.
	 */
	public getC(): number {
		return this.c;
	}

	/**
	 * Returns the d parameter of the Regression.
	 * @returns the d parameter.
	 */
	public getD(): number {
		return this.d;
	}

	public setParams(newParams: number[]): void {
		if (newParams.length !== PolyRegression.NB_PARAMS) {
			throw new Error(
				'Error: could not load the PolyRegression Model. There are ' +
					newParams.length +
					' when there should be ' +
					PolyRegression.NB_PARAMS,
			);
		}
		// Assigning the values to each parameter.
		this.a = newParams[0];
		this.b = newParams[1];
		this.c = newParams[2];
		this.d = newParams[3];
	}

	public paramsToString(): string {
		const rounding = PolyRegression.getRounding();
		const roundA = Math.round(this.a * rounding) / rounding;
		const roundB = Math.round(this.b * rounding) / rounding;
		const roundC = Math.round(this.c * rounding) / rounding;
		const roundD = Math.round(this.d * rounding) / rounding;
		return (
			'a = ' +
			roundA +
			', b = ' +
			roundB +
			', c = ' +
			roundC +
			', d = ' +
			roundD
		);
	}

	public predictOne(input: number): number {
		const x: number = input;
		return this.a * Math.pow(x, 3) + this.b * x * x + this.c * x + this.d;
	}
}
