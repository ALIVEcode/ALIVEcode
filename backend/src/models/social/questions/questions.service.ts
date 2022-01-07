import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question) private questionRepository: Repository<Question>,
  ) {}
  async create(createQuestionDto: Question) {
    const question = this.questionRepository.save(this.questionRepository.create(createQuestionDto));
    return await question;
  }

  findAll() {
    return `This action returns all questions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  async update(id: number, updateQuestionDto: Question) {
    updateQuestionDto.id = id;
    const question = this.questionRepository.save(updateQuestionDto);
    return await question
  }

  async remove(id: number) {
    const question = await this.questionRepository.delete(id);
    return await question
  }
}
