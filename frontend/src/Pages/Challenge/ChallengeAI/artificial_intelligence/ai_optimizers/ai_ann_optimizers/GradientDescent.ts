import { Matrix } from '../../AIUtils';
import { CostFunction } from '../../ai_functions/Function';
import { NeuralNetwork } from '../../ai_models/ai_neural_networks/NeuralNetwork';


export class GradientDescent
{
  private learningRate: number;
  private epochs: number;
  private model: NeuralNetwork;
  private costFunc: CostFunction;
  
  public constructor(model: NeuralNetwork, costFunc: CostFunction, learningRate: number, epochs: number)
  {
    this.learningRate = learningRate;
    this.epochs = epochs;
    this.model = model;
    this.costFunc = costFunc;
  }

  public computeLayer()
  {
    let dz: Matrix;
    let dw: Matrix;
    let db: Matrix;
  }

  public MSEDerivative(predicted: number[][], real: number[][]): number
  {
    let output: number = 0.0;
    let nbElements: number = real.length;
    for(let i: number = 0; i < nbElements; i++)
    {
      if (predicted[i][1] > 0) output = 2 * (predicted[i][1] - real[i][1]);
    }
    return output / nbElements;
  }
}