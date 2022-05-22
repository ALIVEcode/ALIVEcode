import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedbackEntity } from './entities/feedback.entity';

@Injectable()
export class FeedbacksService {
  constructor(@InjectRepository(FeedbackEntity) private feedbackRepository: Repository<FeedbackEntity>) {}

  async create(createFeedbackDto: CreateFeedbackDto) {
    return await this.feedbackRepository.save(createFeedbackDto);
  }

  async findAll() {
    return await this.feedbackRepository.find();
  }

  async findOne(id: number) {
    return await this.feedbackRepository.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} feedback`;
  }
}
