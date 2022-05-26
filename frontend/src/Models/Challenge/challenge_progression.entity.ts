import { Transform, Type } from 'class-transformer';
import AIModel, { MODEL_TYPES } from '../Ai/ai_model.entity';
import { IoTProject, IoTProjectLayout } from '../Iot/IoTproject.entity';
import { NeuralNetwork } from '../../Pages/Challenge/ChallengeAI/artificial_intelligence/ai_models/ai_neural_networks/NeuralNetwork';
import { GenAIModel } from '../../Pages/Challenge/ChallengeAI/artificial_intelligence/AIUtilsInterfaces';

export type ChallengeAliveProgressionData = {
	code?: string;
};

export type ChallengeCodeProgressionData = {
	code?: string;
};

export type ChallengeIoTProgressionData = {
	layout?: IoTProjectLayout;
	code?: string;
};

export type ChallengeProgressionData =
	| ChallengeAliveProgressionData
	| ChallengeCodeProgressionData
	| ChallengeIoTProgressionData;

export class ChallengeProgression {
	id: string;

	challengeId: string;

	data: ChallengeProgressionData;

	@Type(() => AIModel)
	@Transform(({ value }) => {
		const dtoModel = value;
		if (!dtoModel) return dtoModel;

		switch (dtoModel.type) {
			case MODEL_TYPES.NEURAL_NETWORK:
				// TODO : Check for valid Model parameters and hyperparameters
				console.log(dtoModel);
				return new NeuralNetwork(
					dtoModel.id,
					dtoModel.hyperparameters,
					dtoModel.modelParams,
				);
			case MODEL_TYPES.POLY_REGRESSION:
				// TODO : Add poly regression model
				break;
		}
		return undefined;
	})
	aiModel?: GenAIModel;
	aiModelId: string;

	@Type(() => IoTProject)
	iotProject: IoTProject;

	iotProjectId: string;
}
