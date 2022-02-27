import { create, all } from 'mathjs';
const config = {};
const math = create(all, config);

export class ActivationFunction {

  static RELU: number = 0;
  static SIGMOID: number = 1;
  static TANH: number = 2;

  constructor(
    private type: number
  ) {}

  public compute(input: number): number {
    let output: number = 0;
    
    switch (this.type) {
      case ActivationFunction.RELU:
        output = this.computeReLU(input);
        break;
      case ActivationFunction.SIGMOID:
        output = this.computeSigmoid(input);
        break;
      case ActivationFunction.TANH:
        output = this.computeTanH(input);
    }

    return output;
  }

  private computeReLU(input: number): number {
    return Math.max(0, input);
  }

  private computeSigmoid(input: number): number {
    return 1 / (1 + Math.exp(-input));
  }

  private computeTanH(input: number): number {
    return (Math.exp(input) - Math.exp(-input)) / (Math.exp(input) + Math.exp(-input));
  }

}

export class CostFunction {

  static MSE: number = 0;
  static MAE: number = 0;

  public compute(inputs: number[]): number {
    
  }

  
}
