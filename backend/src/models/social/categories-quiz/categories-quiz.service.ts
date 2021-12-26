import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoriesQuizDto } from './dto/create-categories-quiz.dto';
import { UpdateCategoriesQuizDto } from './dto/update-categories-quiz.dto';
import { CategoriesQuiz } from './entities/categories-quiz.entity';

@Injectable()
export class CategoriesQuizService {
  constructor(
    @InjectRepository(CategoriesQuiz) private CategoriesRepository: Repository<CategoriesQuiz>,
  ) {}


  create(createCategoriesQuizDto: CreateCategoriesQuizDto) {
    return 'This action adds a new categoriesQuiz';
  }

  async findAll() {
    return await this.CategoriesRepository.find({ relations: ['quizzes'] });
  }

  async findOne(id: number) {
    return await this.CategoriesRepository.findOne(id, { relations: ['quizzes'] });
  }

  async update(id: number, updateCategoriesQuizDto: CategoriesQuiz) {
    updateCategoriesQuizDto.id = id;
    const category = this.CategoriesRepository.save(updateCategoriesQuizDto);
    return await category
  }

  async remove(id: number) {
    return await this.CategoriesRepository.delete(id);
  }
}
