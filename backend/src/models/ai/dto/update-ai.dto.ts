import { PartialType } from '@nestjs/swagger';
import { CreateAiDto } from './create-ai.dto';

export class UpdateAiDto extends PartialType(CreateAiDto) {}
