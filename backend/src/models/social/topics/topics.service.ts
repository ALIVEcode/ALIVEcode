import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTopicsDto } from './dto/create-topics.dto';
import { UpdateTopicsDto } from './dto/update-topics.dto';
import { Topics } from './entities/topics.entity';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topics) private topicsRepository: Repository<Topics>,
  ) {}

  create(createTopicsDto: CreateTopicsDto) {
    return 'This action adds a new Topics';
  }

  async findAll() {
    return await this.topicsRepository.find();  }

  findOne(id: number) {
    return `This action returns a #${id} Topics`;
  }

  update(id: number, updateTopicsDto: UpdateTopicsDto) {
    return `This action updates a #${id} Topics`;
  }

  remove(id: number) {
    return `This action removes a #${id} Topics`;
  }
}
