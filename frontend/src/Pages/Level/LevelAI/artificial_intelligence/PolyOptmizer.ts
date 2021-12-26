import RegressionOptimizer from "./RegressionOptimizer";
import PolyRegression from "../../../../Components/LevelComponents/LevelGraph/PolyRegression";
import DataSample from "./DataSample";

/**
 * This class contains all necessary methods to optimize a polynomial regression
 * of the third degree maximum.
 * It uses the mean squared error as its loss function and sigmoid as its activation
 * function.
 * The polynomial regression always stay of the same degree after the optimization.
 */
export default class PolyOptimizer extends RegressionOptimizer {

  protected costDerivative(predicted: number[], real: number[]): number {
    let sum: number = 0;
    for (let i: number = 0; i < predicted.length; i++) {
      sum += 2 * predicted[i] * (1 - predicted[i]) * (predicted[i] - real[i]);
      //sum += predicted[i] - real[i];
    }
    return sum / predicted.length;
  }

  protected paramDerivative(param: string, costDeriv: number, inputs: number[]): number {
    let sum: number = 0;
    let pow: number = 0;
    if (param === 'a') pow = 1;
    else if (param === 'b') pow = 1;
    else if (param === 'c') pow = 1;
    else if (param === 'd') pow = 1;
    else throw new Error ("The parameter doesn't exist");

    for (let i: number = 0; i < inputs.length; i++) {
      sum += costDeriv * Math.pow(inputs[i], pow);
    }

    return sum / inputs.length;
  }

  public optimize(dataset: DataSample[]): PolyRegression {
    let numEpoch: number = 0;
    let gradientDirection = -1;

    // Initial values
    const independent: number[] = dataset.map((sample: DataSample) => sample['x']);
    const normIndependent: number[] = RegressionOptimizer.normalize(independent);
    const expected: number[] = dataset.map((sample: DataSample) => sample['y']);
    const normExpected: number[] = RegressionOptimizer.normalize(expected);
    const activatedExp: number[] = RegressionOptimizer.sigmoidAll(normExpected);
    
    let predicted: number[] = this.regression.computeAll(normIndependent);
    let normPredicted: number[] = RegressionOptimizer.normalize(predicted)
    let activatedPred: number[] = RegressionOptimizer.sigmoidAll(normPredicted);
    this.error = this.costFunc(activatedPred, activatedExp);

    // Copy of the PolyRegression
    let regCopy: PolyRegression = this.regression.copy();
    while (numEpoch < this.epoch) {
      // Backpropagation
      // 1. Cost derivative
      let costDev = this.costDerivative(activatedPred, activatedExp);
      // 2. Parameter update
      // We multiply by param/param to avoid increasing a 0 variable
      regCopy.setParams(
        regCopy.getA() - (this.learningRate * this.paramDerivative('a', costDev, independent) 
        * gradientDirection * (regCopy.getA()/(regCopy.getA() + this.EPSILON))), 
        regCopy.getB() - (this.learningRate * this.paramDerivative('b', costDev, independent) 
        * gradientDirection * (regCopy.getB()/(regCopy.getB() + this.EPSILON))), 
        regCopy.getC() - (this.learningRate * this.paramDerivative('c', costDev, independent) 
        * gradientDirection * (regCopy.getC()/(regCopy.getC() + this.EPSILON))), 
        regCopy.getD() - (this.learningRate * this.paramDerivative('d', costDev, independent) 
        * gradientDirection * (regCopy.getD()/(regCopy.getD() + this.EPSILON))), 
      )

      // 3. Recalculate predictions
      predicted = regCopy.computeAll(independent);
      normPredicted = RegressionOptimizer.normalize(predicted);
      activatedPred = RegressionOptimizer.sigmoidAll(RegressionOptimizer.normalize(predicted));
      if (this.costFunc(predicted, expected) > this.error) gradientDirection = gradientDirection * -1;
      this.error = this.costFunc(predicted, expected);
      numEpoch++;
    }
    console.log(regCopy);
    return regCopy;
  }
  
}