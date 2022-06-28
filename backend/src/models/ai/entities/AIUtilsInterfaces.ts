import { ACTIVATION_FUNCTIONS, COST_FUNCTIONS, NN_OPTIMIZER_TYPES } from './ai_model.entity';

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
	type: NN_OPTIMIZER_TYPES.GradientDescent;
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
	NN: NNHyperparameters;
	POLY: RegHyperparameters;
}

export type Hyperparameters = GenHyperparameters[keyof GenHyperparameters];

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
