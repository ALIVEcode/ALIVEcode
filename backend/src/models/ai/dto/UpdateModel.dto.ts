import { PartialType } from '@nestjs/swagger';
import { AIModelEntity } from '../entities/ai_model.entity';

export class UpdateModelDTO extends PartialType(AIModelEntity) {}
