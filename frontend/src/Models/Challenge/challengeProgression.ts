import { Type } from 'class-transformer';
import { AIModel } from '../Ai/ai_model.entity';
import { IoTProject, IoTProjectLayout } from '../Iot/IoTproject.entity';

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
	aiModel: AIModel;
	aiModelId: string;

	@Type(() => IoTProject)
	iotProject: IoTProject;

	iotProjectId: string;
}
