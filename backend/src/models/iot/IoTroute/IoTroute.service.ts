import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IoTRouteEntity } from './entities/IoTroute.entity';
import { Repository } from 'typeorm';
import { IoTProjectEntity } from '../IoTproject/entities/IoTproject.entity';

@Injectable()
export class IoTRouteService {
  constructor(
    @InjectRepository(IoTRouteEntity) private routeRepository: Repository<IoTRouteEntity>,
    @InjectRepository(IoTProjectEntity) private projectRepository: Repository<IoTProjectEntity>,
  ) {}

  async create(project: IoTProjectEntity, createIoTprojectDto: IoTRouteEntity) {
    const route = this.routeRepository.create(createIoTprojectDto);
    await this.routeRepository.save(route);

    project = await this.projectRepository.findOne(project, { relations: ['routes'] });
    project.routes.push(route);
    return route;
  }

  async findAll() {
    return await this.routeRepository.find();
  }

  async findOne(id: string) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const route = await this.routeRepository.findOne(id);
    if (!route) throw new HttpException('IoTObject not found', HttpStatus.NOT_FOUND);
    return route;
  }

  async update(id: string, updateIoTprojectDto: IoTRouteEntity) {
    return await this.routeRepository.save({ ...updateIoTprojectDto, id });
  }

  async remove(id: string) {
    return await this.routeRepository.delete(id);
  }
}
