import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriesQuizDto } from './create-categories-quiz.dto';

export class UpdateCategoriesQuizDto extends PartialType(CreateCategoriesQuizDto) {}
