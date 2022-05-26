import Optimizer from '../Optimizer';
import { RegHyperparameters, GenRegression } from '../../AIUtilsInterfaces';
import { Matrix } from '../../AIUtils';

/**
 * Superclass for every Optimizer class. It contains all usefull static and abstract methods
 * for AI algorithms and optimization techniques.
 *
 * @author Félix Jobin
 */
export default abstract class RegressionOptimizer extends Optimizer {
	protected static EPSILON: number = 1e-8;
	protected hyperparams: RegHyperparameters;
	protected model: GenRegression;

	/**
	 * Creates a RegressionOptimizer with a Regression object.
	 * @param regression the regression to optimize.
	 * @param hyperparams the hyperparameters realted to the regression model.
	 */
	constructor(model: GenRegression, hyperparams: RegHyperparameters) {
		super(
			hyperparams.learningRate,
			hyperparams.epochs,
			hyperparams.costFunction,
		);
		this.hyperparams = hyperparams;
		this.model = model;
	}

	/**
	 * COmputes the derivative of the specified parameter of the model with an array of input values.
	 * @param param the parameter for which the derivative is calculated.
	 * @param inputs the array of input values.
	 * @param costDeriv the calculated cost derivative for the same inputs.
	 * @return the calculated parameter's derivative.
	 */
	protected abstract paramDerivative(
		param: string,
		costDeriv: Matrix,
		inputs: Matrix,
	): number;

	public abstract optimize(inputs: Matrix, real: Matrix): GenRegression;
}
