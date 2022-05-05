import { Type } from 'class-transformer';
import { Challenge } from '../challenge.entity';
import { MODEL_TYPES } from '../../Ai/ai_model.entity';
import { AIDataset } from '../../Ai/ai_dataset.entity';

export class ChallengeAI extends Challenge {
	initialCode?: string;

	solution?: string;

	modelType: MODEL_TYPES;

	@Type(() => AIDataset)
	dataset?: AIDataset;

	datasetId: string;
}
