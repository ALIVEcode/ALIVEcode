import { Injectable, HttpException, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IoTProjectEntity, IoTProjectLayout } from './entities/IoTproject.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { IoTRouteEntity } from '../IoTroute/entities/IoTroute.entity';
import { IoTObjectEntity } from '../IoTobject/entities/IoTobject.entity';
import { IoTSocketUpdateRequestWatcher, WatcherClient } from '../../../socket/iotSocket/iotSocket.types';
import { validUUID } from '../../../utils/types/validation.types';
import { IoTProjectAddScriptDTO } from './dto/addScript.dto';
import { AsScriptEntity } from '../../as-script/entities/as-script.entity';
import { AsScriptService } from '../../as-script/as-script.service';

@Injectable()
export class IoTProjectService {
  constructor(
    @InjectRepository(IoTProjectEntity) private projectRepository: Repository<IoTProjectEntity>,
    @InjectRepository(IoTRouteEntity) private routeRepository: Repository<IoTRouteEntity>,
    @InjectRepository(AsScriptEntity) private scriptRepo: Repository<AsScriptEntity>,
    @Inject(forwardRef(() => AsScriptService)) private asScriptService: AsScriptService,
  ) {}

  async create(user: UserEntity, createIoTprojectDto: IoTProjectEntity) {
    const project = this.projectRepository.create(createIoTprojectDto);
    project.creator = user;
    return await this.projectRepository.save(project);
  }

  async findAll() {
    return await this.projectRepository.find();
  }

  async findOne(id: string) {
    if (!id || !validUUID(id)) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const project = await this.projectRepository.findOne(id);
    if (!project) throw new HttpException('IoTProject not found', HttpStatus.NOT_FOUND);
    return project;
  }

  async findOneWithRoute(id: string, routePath: string) {
    if (!id || !validUUID(id) || !routePath) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const project = await this.projectRepository.findOne(id, { relations: ['routes'] });
    if (!project) throw new HttpException('IoTProject not found', HttpStatus.NOT_FOUND);

    const route = project.routes.find(r => r.path === routePath);
    if (!route) throw new HttpException('Route not found', HttpStatus.NOT_FOUND);

    return { route, project };
  }

  async update(id: string, updateIoTprojectDto: IoTProjectEntity) {
    return await this.projectRepository.save({ id, ...updateIoTprojectDto });
  }

  async remove(id: string) {
    return await this.projectRepository.delete(id);
  }

  async updateLayout(id: string, layout: IoTProjectLayout) {
    const project = await this.findOne(id);

    layout.components = layout.components.filter((c: any) => c != null && JSON.stringify(c) != '{}');

    return await this.projectRepository.save({ ...project, layout });
  }
  async getRoutes(project: IoTProjectEntity) {
    return (await this.projectRepository.findOne(project.id, { relations: ['routes'] })).routes;
  }

  async addRoute(project: IoTProjectEntity, routeDTO: IoTRouteEntity) {
    const newRoute = this.routeRepository.create(routeDTO);
    await this.routeRepository.save(newRoute);
    project = await this.projectRepository.findOne(project.id, { relations: ['routes'] });
    project.routes.push(newRoute);
    await this.projectRepository.save(project);
    return newRoute;
  }

  async getObjects(project: IoTProjectEntity) {
    return (await this.projectRepository.findOne(project.id, { relations: ['iotObjects'] })).iotObjects;
  }

  async addObject(project: IoTProjectEntity, object: IoTObjectEntity) {
    project = await this.projectRepository.findOne(project.id, { relations: ['iotObjects'] });
    project.iotObjects.push(object);
    await this.projectRepository.save(project);
    return object;
  }

  async addScript(project: IoTProjectEntity, user: UserEntity, scriptDto: IoTProjectAddScriptDTO) {
    const newScript = this.scriptRepo.create(scriptDto.script);
    newScript.creator = user;
    await this.scriptRepo.save(newScript);

    project = await this.projectRepository.findOne(project.id, { relations: ['routes'] });

    const route = project.routes.find(r => r.id === scriptDto.routeId);
    if (!route) throw new HttpException('No route found', HttpStatus.NOT_FOUND);

    route.asScript = newScript;

    await this.routeRepository.save(route);
    return newScript;
  }

  async sendRoute(route: IoTRouteEntity, data: any) {
    await this.asScriptService.compileBackend({ lines: route.asScript.content }, data);
  }

  async updateComponent(project: IoTProjectEntity, componentId: string, value: any, sendUpdate = false): Promise<void> {
    const layoutManager = project.getLayoutManager();
    layoutManager.updateComponent(componentId, value);
    await this.projectRepository.save(project);

    if (sendUpdate) {
      const watchers = WatcherClient.getClientsByProject(project.id);

      const data: IoTSocketUpdateRequestWatcher = {
        id: componentId,
        value,
      };

      watchers.forEach(w => w.sendCustom('update', data));
    }
  }
}
