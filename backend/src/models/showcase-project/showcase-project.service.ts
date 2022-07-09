import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShowcaseProjectEntity } from './entities/showcase-project.entity';
import { Repository } from 'typeorm';
import { ShowcaseProjectGalleryGetDTO } from './dto/ShowcaseProjectGalleryGet.dto';

@Injectable()
export class ShowcaseProjectService {
  constructor(
    @InjectRepository(ShowcaseProjectEntity) private readonly projectRepo: Repository<ShowcaseProjectEntity>,
  ) {}

  async findAll() {
    return await this.projectRepo.find();
  }

  async getGallery(query: ShowcaseProjectGalleryGetDTO) {
    return await this.projectRepo.find({ where: { subject: query.subject }, take: query.nbItems });
  }

  async findOne(name: string) {
    if (!name) throw new HttpException('No name specified.', HttpStatus.BAD_REQUEST);
    const project = await this.projectRepo.findOne(name);
    if (!project) throw new HttpException(`No showcase project with the name ${name}`, HttpStatus.NOT_FOUND);
    return project;
  }
}
