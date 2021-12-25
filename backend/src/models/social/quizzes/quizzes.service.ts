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
    return await this.quizRepository.find({ relations: ['reward', 'questions'] });
  }

  async findOne(id: number) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const quiz = await this.quizRepository.findOne(id);
    if (!quiz) throw new HttpException('Quiz not found', HttpStatus.NOT_FOUND);
    return quiz;
  }

  async update(id: number, updateQuizDto: UpdateQuizDto) {
    return 'This Updates a Quiz';
  }

  remove(id: number) {
    return `This action removes a #${id} quiz`;
  }
}
