import { Injectable } from '@nestjs/common';
import { CreateCategoriesQuizDto } from './dto/create-categories-quiz.dto';
import { UpdateCategoriesQuizDto } from './dto/update-categories-quiz.dto';

@Injectable()
export class CategoriesQuizService {
  create(createCategoriesQuizDto: CreateCategoriesQuizDto) {
    return 'This action adds a new categoriesQuiz';
  }

  findAll() {
    return `This action returns all categoriesQuiz`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoriesQuiz`;
  }

  update(id: number, updateCategoriesQuizDto: UpdateCategoriesQuizDto) {
    return `This action updates a #${id} categoriesQuiz`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoriesQuiz`;
  }
}
