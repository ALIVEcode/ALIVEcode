import AIModel, {
	ACTIVATION_FUNCTIONS,
	COST_FUNCTIONS,
	NN_OPTIMIZER_TYPES,
} from '../../../../Models/Ai/ai_model.entity';
import { PolyRegression } from './ai_models/ai_regression/PolyRegression';
import { Regression } from './ai_models/ai_regression/Regression';
import { NNOptimizer } from './ai_optimizers/ai_nn_optimizers/NNOptimizer';
import { GradientDescent } from './ai_optimizers/ai_nn_optimizers/GradientDescent';
import { NeuralNetwork } from './ai_models/ai_neural_networks/NeuralNetwork';
import PolyOptimizer from './ai_optimizers/ai_reg_optimizers/PolyOptmizer';
import { MODEL_TYPES } from '../../../../Models/Ai/ai_model.entity';

/*
This file gathers all enum classes and interfaces used in AI algorithms.
They generally describe objects or types of Model/Optimizer.
*/

/**
 * This interface describes the json object containing all hyperparameters of
 * a NeuralNetwork Model.
 */
export interface NNHyperparameters {
	nbInputs: number; // number of inputs
	nbOutputs: number; // number of outputs
	neuronsByLayer: number[]; // number of neurons in each hidden layer
	// activation function in hidden layers and in the output layer
	activationsByLayer: ACTIVATION_FUNCTIONS[];
	costFunction: COST_FUNCTIONS;
	learningRate: number;
	epochs: number;
	type: NN_OPTIMIZER_TYPES;
}

/**
 * This interface describes the json object containing all hyperparameters of
 * a Regression Model.
 */
export interface RegHyperparameters {
	modelParams: RegModelParams;
	costFunction: COST_FUNCTIONS;
	learningRate: number;
	epochs: number;
}

export interface GenHyperparameters {
	neuralNetwork: NNHyperparameters;
	polyRegression: RegHyperparameters;
}

/**
 * This interface describles the json object containing all Model parameters from
 * all layers of a NeuralNetwork Model
 */
export interface NNModelParams {
	layerParams: LayerParams[];
}

/**
 * This interface describes the json object containing all Model parameters from
 * a specific layer of a NeuralLayer Model.
 */
export interface LayerParams {
	weights: number[][];
	biases: number[];
}

export interface RegModelParams {
	params: number[];
}

export type GenRegression = PolyRegression;
export type GenOptimizer = GradientDescent | PolyOptimizer;
export type GenAIModel = PolyRegression | NeuralNetwork;
export type GenModelParams = NNModelParams | RegModelParams;
