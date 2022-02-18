import { PartialType } from '@nestjs/mapped-types';
import { CreateTopicsDto } from './create-topics.dto';

export class UpdateTopicsDto extends PartialType(CreateTopicsDto) {}
