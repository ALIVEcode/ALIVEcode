import { PartialType } from '@nestjs/swagger';
import { AIDatasetEntity } from '../entities/ai_dataset.entity';

export class UpdateDatasetDTO extends PartialType(AIDatasetEntity) {}
