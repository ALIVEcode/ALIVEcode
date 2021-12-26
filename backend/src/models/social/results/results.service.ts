import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { Result } from './entities/result.entity';

@Injectable()
export class ResultsService {
  [x: string]: any;
  constructor(
    @InjectRepository(Result) private resultRepository: Repository<Result>,
  ) {}
  create(createResultDto: CreateResultDto) {
    return 'This action adds a new result';
  }

  findAll() {
    return `This action returns all results`;
  }



  findAndCount(percentage: number){
      return this.resultRepository.findAndCount({
        'percentage' : MoreThan(percentage)
      })
  }
  getResults() {
    return  this.resultRepository.find({    
    })
  }
  findOne(id: number) {
    return `This action returns a #${id} result`;
  }
  update(id: number, updateResultDto: UpdateResultDto) {
    return `This action updates a #${id} result`;
  }

  remove(id: number) {
    return `This action removes a #${id} result`;
  }
}
