import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { Quiz } from './entities/quiz.entity';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz) private quizRepository: Repository<Quiz>,
  ) {}
  async create(createQuizDto: Quiz) {
    const quiz = this.quizRepository.save(this.quizRepository.create(createQuizDto));
    return await quiz;
  }

  async findAll() {
    const quizzes = await this.quizRepository.find({ relations: ['reward', 'questions'] });
    console.log(quizzes);
    return quizzes;
  }

  async findOne(id: number,) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const quiz = await this.quizRepository.findOne(id, { relations: ['reward', 'questions'] });
    console.log(quiz);
    if (!quiz) throw new HttpException('Quiz not found', HttpStatus.NOT_FOUND);
    return quiz;
  }

  async update(id: number, updateQuizDto: Quiz) {
    updateQuizDto.id = id;
    const quiz = this.quizRepository.save(updateQuizDto);
    return await quiz
  }

  async remove(id: number) {
    const quiz = await this.quizRepository.delete(id);
    return await quiz
  }
}
