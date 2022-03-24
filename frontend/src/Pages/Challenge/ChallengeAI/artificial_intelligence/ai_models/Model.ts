import { Matrix } from "../AIUtils";

export abstract class Model 
{
  protected nbInputs: number;
  protected nbOutputs: number
  /**
   * Creates a general Model by specifying the number of inputs and outputs.
   * @param nbInputs the Model's number of inputs.
   * @param nbOutputs the Model's number of outputs.
   */
  public constructor(nbInputs: number, nbOutputs: number) 
  {
    this.nbInputs = nbInputs;
    this.nbOutputs = nbOutputs;
  }

  /**
   * Computes the outputs of the model based on the given inputs.
   * @param inputs the inputs from which to compute the outputs (1 x nbInputs).
   * @returns the outputs of the model.
   */
  public abstract predict(inputs: Matrix): Matrix;

}