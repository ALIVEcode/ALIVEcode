import { ActivationFunction } from "./ai_functions/ActivationFunction"
import { CostFunction } from "./ai_functions/CostFunction"
import { NNOptimizer } from "./ai_optimizers/ai_nn_optimizers/NNOptimizer"
import { Optimizer } from "./ai_optimizers/Optimizer"

/*
This file gathers all enum classes and interfaces used in AI algorithms.
They generally describe objects or types of Model/Optimizer.
*/

/**
 * This enum describes all possible types of Model available in AI levels.
 * The current types of Model available are:
 * - NeuralNetwork
 * - Regression
 */
export enum ModelTypes {
  NeuralNetwork,
  Regression
}

/**
 * This enum describes all possible types of Regression available in AI levels.
 * The current types of Regression available are:
 * - Polynomial
 */
export enum RegressionTypes {
  Polynomial
}

/**
 * This enum describes all possible types of optimizers available for Neural Networks
 * in AI levels.
 * The current types of Regression available are:
 * - GradientDescent
 */
export enum NNOptimizerTypes {
  GradientDescent
}

/**
 * This interface describes the json object containing all hyperparameters of 
 * a NeuralNetwork Model.
 */
export interface NNHyperparameters {
  model: {
    "nb_inputs": number, // number of inputs
    "nb_outputs": number, // number of outputs
    "neurons_by_layer": number[], // number of neurons in each hidden layer
    // activation function in hidden layers and in the output layer
    "activations_by_layer": ActivationFunction[] 
  },
  optimizer: {
    "cost_function": CostFunction,
    "learning_rate": number,
    "epochs": number,
    "type": NNOptimizerTypes
  }
}

/**
 * This interface describes the json object containing all hyperparameters of 
 * a Regression Model.
 */
export interface RegHyperparameters {
  model: {
    "RegressionType": RegressionTypes
  },
  optimizer: {
    "costFunction": CostFunction,
    "learningRate": number,
    "epochs": number,
    "type": Optimizer
  }
}

/**
 * This interface describles the json object containing all Model parameters from
 * all layers of a NeuralNetwork Model
 */
export interface NNModelParams {
  layerParams: LayerParams[]
}

/**
 * This interface describes the json object containing all Model parameters from 
 * a specific layer of a NeuralLayer Model.
 */
export interface LayerParams {
  weights: number[][],
  biases: number[]
}

export interface RegModelParams {
  params: number[]
}