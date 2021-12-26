import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoriesSubjectDto } from './dto/create-categories-subject.dto';
import { UpdateCategoriesSubjectDto } from './dto/update-categories-subject.dto';
import { CategoriesSubject } from './entities/categories-subject.entity';

@Injectable()
export class CategoriesSubjectsService {
  constructor(
    @InjectRepository(CategoriesSubject) private categoriesSubjectRepository: Repository<CategoriesSubject>,
  ) {}
  
  create(createCategoriesSubjectDto: CreateCategoriesSubjectDto) {
    return 'This action adds a new categoriesSubject';
  }

  async findAll() {
    return await this.categoriesSubjectRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} categoriesSubject`;
  }

  update(id: number, updateCategoriesSubjectDto: UpdateCategoriesSubjectDto) {
    return `This action updates a #${id} categoriesSubject`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoriesSubject`;
  }
}
