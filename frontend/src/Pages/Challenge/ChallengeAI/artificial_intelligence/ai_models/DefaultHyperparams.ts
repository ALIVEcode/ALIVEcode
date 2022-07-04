import {
	ACTIVATION_FUNCTIONS,
	COST_FUNCTIONS,
	MODEL_TYPES,
	NN_OPTIMIZER_TYPES,
} from '../../../../../Models/Ai/ai_model.entity';
import { GenHyperparameters } from '../AIUtilsInterfaces';

export const defaultHyperparams: GenHyperparameters = {
	NN: {
		nbInputs: 0,
		nbOutputs: 0,
		neuronsByLayer: [7, 5],
		activationsByLayer: [
			ACTIVATION_FUNCTIONS.RELU,
			ACTIVATION_FUNCTIONS.RELU,
			ACTIVATION_FUNCTIONS.SIGMOID,
		],
		costFunction: COST_FUNCTIONS.MEAN_SQUARED_ERROR,
		learningRate: 0.1,
		epochs: 1000,
		type: NN_OPTIMIZER_TYPES.GradientDescent,
	},
	POLY: {
		modelParams: {
			params: [0, 0.1, 1, 1],
		},
		costFunction: COST_FUNCTIONS.MEAN_SQUARED_ERROR,
		learningRate: 0.1,
		epochs: 3000,
	},
	PERC:{
		nbInputs: 0,
		nbOutputs: 0,
		activation: ACTIVATION_FUNCTIONS.RELU,
		costFunction: COST_FUNCTIONS.MEAN_SQUARED_ERROR,
		learningRate: 0.1,
		epochs: 1000,
		type: NN_OPTIMIZER_TYPES.GradientDescent,
	}
};

export const defaultModelType: MODEL_TYPES = MODEL_TYPES.NEURAL_NETWORK;
