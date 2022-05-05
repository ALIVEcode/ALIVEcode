import {
	ACTIVATION_FUNCTIONS,
	COST_FUNCTIONS,
	NN_OPTIMIZER_TYPES,
	REGRESSION_TYPES,
} from '../../../../Models/Ai/ai_model.entity';
import { CostFunction } from './ai_functions/CostFunction';
import Optimizer from './ai_optimizers/Optimizer';

/*
This file gathers all enum classes and interfaces used in AI algorithms.
They generally describe objects or types of Model/Optimizer.
*/

/**
 * This interface describes the json object containing all hyperparameters of
 * a NeuralNetwork Model.
 */
export interface NNHyperparameters {
	model: {
		nb_inputs: number; // number of inputs
		nb_outputs: number; // number of outputs
		neurons_by_layer: number[]; // number of neurons in each hidden layer
		// activation function in hidden layers and in the output layer
		activations_by_layer: ACTIVATION_FUNCTIONS[];
	};
	optimizer: {
		cost_function: COST_FUNCTIONS;
		learning_rate: number;
		epochs: number;
		type: NN_OPTIMIZER_TYPES;
	};
}

/**
 * This interface describes the json object containing all hyperparameters of
 * a Regression Model.
 */
export interface RegHyperparameters {
	model: {
		RegressionType: REGRESSION_TYPES;
	};
	optimizer: {
		costFunction: CostFunction;
		learningRate: number;
		epochs: number;
		type: Optimizer;
	};
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
