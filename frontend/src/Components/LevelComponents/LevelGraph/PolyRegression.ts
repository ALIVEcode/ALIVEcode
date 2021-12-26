import DataSample from '../../../Pages/Level/LevelAI/artificial_intelligence/DataSample';
import DataTypes from './DataTypes';
import RegressionOptimizer from '../../../Pages/Level/LevelAI/artificial_intelligence/RegressionOptimizer';

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
export default class PolyRegression {
  private static ROUNDING = 1000;
  private static DATA_FORMATTING: DataTypes = {
    type: "line",
    label: "Fonction polynomiale",
    data: [{}],
    borderColor: 'rgb(33, 87, 145)',
    borderWidth: 3,
    pointRadius: 3,
    pointBorderWidth: 0,
    pointBackgroundColor: 'black',
  }
  private static NB_POINTS = 20;
  private static MIN_RANGE = 0;
  private static MAX_RANGE = 100;

  /**
   * Creates a function with its 4 parameters.
   * @param a the parameter for x^3.
   * @param b the parameter for x^2.
   * @param c the parameter for x^1.
   * @param d the parameter for x^0.
   */
  constructor(private a: number, private b: number, private c: number, private d: number) {
    
  }

  /**
   * Computes the polynomial regression with the specified input.
   * @param x the input of the regression.
   * @returns the output of the regression.
   */
  public compute(x: number): number {
    return this.a*Math.pow(x, 3) + this.b*x*x + this.c*x + this.d;
  }

  /**
   * Computes the regression for a given array of inputs.
   * @param x an array of inputs.
   * @returns the output for all inputs.
   */
  public computeAll(x: number[]): number[] {
    return x.map((sample: number) => this.compute(sample));
  }

  /**
   * Calculates the MSE cost function for this regression compared to a dataset.
   * @param dataset the dataset to fit.
   * @returns the value of the error.
   */
  public computeMSE(dataset: DataSample[]): number {
    const independent: number[] = dataset.map((sample: DataSample) => sample['x']);
    const expected: number[] = dataset.map((sample: DataSample) => sample['y']);
    const predicted: number[] = this.computeAll(independent);
    return RegressionOptimizer.costMSE(predicted, expected);
  }

  /**
   * Generates an object with formatting settings and an array of points that can be used to be plotted on a graph.
   * @returns an object with formatting settings and an array of points
   */
  public generatePoints(): DataTypes {
    let points = [];

    // Generate points
    const jump = (PolyRegression.MAX_RANGE - PolyRegression.MIN_RANGE) / PolyRegression.NB_POINTS;
    for (let i = 0; i < PolyRegression.NB_POINTS; i++) {
      const x = PolyRegression.MIN_RANGE + i * jump;
      const y = this.a * Math.pow(x, 3) + this.b * x * x + this.c * x + this.d;
      points.push({
        "id": i*this.a*this.b*this.c*this.d*jump,
        "x": x,
        "y": Math.round(y * PolyRegression.ROUNDING) / PolyRegression.ROUNDING
      });
    }

    const data: DataTypes = PolyRegression.DATA_FORMATTING;
    data.data = points;
    return data;
  }

  /**
   * Returns a copy of the existing Regression
   * @returns a copy of the 
   */
  public copy(): PolyRegression {
    return new PolyRegression(this.a, this.b, this.c, this.d);
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

  /**
   * Sets all parameters of the PolyRegression at the same time.
   * @param newA the new parameter for x^3.
   * @param newB the new parameter for x^2.
   * @param newC the new parameter for x^1.
   * @param newD the new parameter for x^0.
   */
  public setParams(newA: number, newB: number, newC: number, newD: number) {
    this.a = newA;
    this.b = newB;
    this.c = newC;
    this.d = newD;
  }

  /**
   * Returns the rounding factor of the class.
   * @returns the rounding factor.
   */
  public static getRounding() {
    return PolyRegression.ROUNDING;
  }

  public paramsToString(): string {
    const rounding = PolyRegression.getRounding()
    const roundA = Math.round(this.a * rounding) / rounding;
    const roundB = Math.round(this.b * rounding) / rounding;
    const roundC = Math.round(this.c * rounding) / rounding;
    const roundD = Math.round(this.d * rounding) / rounding;
    return "a = " + roundA + ", b = " + roundB + ", c = " + roundC + ", d = " + roundD;
  }
}


