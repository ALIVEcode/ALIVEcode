import { Type } from 'class-transformer';
import { Challenge } from '../challenge.entity';
import { MODEL_TYPES } from '../../Ai/ai_model.entity';
import { AIDataset } from '../../Ai/ai_dataset.entity';
import { GenHyperparameters } from '../../../Pages/Challenge/ChallengeAI/artificial_intelligence/AIUtilsInterfaces';

export class ChallengeAI extends Challenge {
	initialCode?: string;

	hyperParams: GenHyperparameters;

	solution?: string;

	modelType: MODEL_TYPES;

	@Type(() => AIDataset)
	dataset?: AIDataset;

	datasetId: string;
}
