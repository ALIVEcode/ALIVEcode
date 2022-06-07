import {
	ACTIVATION_FUNCTIONS,
	COST_FUNCTIONS,
	NN_OPTIMIZER_TYPES,
} from '../../../../../Models/Ai/ai_model.entity';
import { GenHyperparameters } from '../AIUtilsInterfaces';

export const defaultHyperparams: GenHyperparameters = {
	neuralNetwork: {
		nbInputs: 3,
		nbOutputs: 1,
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
	polyRegression: {
		modelParams: {
			params: [0, 0.1, 1, 1],
		},
		costFunction: COST_FUNCTIONS.MEAN_SQUARED_ERROR,
		learningRate: 0.1,
		epochs: 1000,
	},
};
