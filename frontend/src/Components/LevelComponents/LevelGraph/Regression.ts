
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
export default class Regression {
  private static ROUNDING = 100;
  private static DATA_FORMATTING = {
    type: "line",
		label: "Fonction polynomiale",
		data: [{}],
    borderColor: 'rgb(33, 87, 145)',
		borderWidth: 3,
    pointRadius: 3,
    pointBorderWidth: 0,
    pointBackgroundColor: 'black'
  }
  private static NB_POINTS = 20;
  private static MIN_RANGE = 20;
  private static MAX_RANGE = 80;

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
   * Generates an object with formatting settings and an array of points that can be used to be plotted on a graph.
   * @returns an object with formatting settings and an array of points
   */
  public generatePoints(): any {
    let points = [];

    // Generate points
    const jump = (Regression.MAX_RANGE - Regression.MIN_RANGE) / Regression.NB_POINTS;
    for (let i = 0; i < Regression.NB_POINTS; i++) {
      const x = Regression.MIN_RANGE + i * jump;
      const y = this.a * Math.pow(x, 3) + this.b * x * x + this.c * x + this.d;
      points.push({
        "id": i*this.a*this.b*this.c*this.d*jump,
        "x": x,
        "y": Math.round(y * Regression.ROUNDING) / Regression.ROUNDING
      });
    }

    const data = Regression.DATA_FORMATTING;
    data.data = points;
    console.log(data)
    return data;
  }
}

