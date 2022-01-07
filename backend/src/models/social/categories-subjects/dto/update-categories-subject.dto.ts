import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriesSubjectDto } from './create-categories-subject.dto';

export class UpdateCategoriesSubjectDto extends PartialType(CreateCategoriesSubjectDto) {}
