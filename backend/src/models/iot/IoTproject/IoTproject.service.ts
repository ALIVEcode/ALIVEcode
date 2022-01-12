import { Injectable, HttpException, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IoTProjectEntity, IoTProjectLayout, IoTProjectDocument, JsonObj } from './entities/IoTproject.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { IoTRouteEntity } from '../IoTroute/entities/IoTroute.entity';
import { IoTObjectEntity } from '../IoTobject/entities/IoTobject.entity';
import {
  IoTUpdateDocumentRequestToWatcher,
  IoTUpdateRequestToWatcher,
  WatcherClient,
} from '../../../socket/iotSocket/iotSocket.types';
import { validUUID } from '../../../utils/types/validation.types';
import { IoTProjectAddScriptDTO } from './dto/addScript.dto';
import { AsScriptEntity } from '../../as-script/entities/as-script.entity';
import { AsScriptService } from '../../as-script/as-script.service';
import { LevelService } from '../../level/level.service';
import { LevelProgressionEntity } from '../../level/entities/levelProgression.entity';
import { IoTProjectUpdateDTO } from './dto/updateProject.dto';
import { IoTUpdateLayoutRequestToWatcher, ObjectClient } from '../../../socket/iotSocket/iotSocket.types';

@Injectable()
export class IoTProjectService {
  constructor(
    @InjectRepository(IoTProjectEntity) private projectRepository: Repository<IoTProjectEntity>,
    @InjectRepository(IoTRouteEntity) private routeRepository: Repository<IoTRouteEntity>,
    @InjectRepository(AsScriptEntity) private scriptRepo: Repository<AsScriptEntity>,
    @InjectRepository(LevelProgressionEntity) private progressionRepo: Repository<LevelProgressionEntity>,
    private levelService: LevelService,
    @Inject(forwardRef(() => AsScriptService)) private asScriptService: AsScriptService,
  ) {}

  getDocumentEntries(document: IoTProjectDocument, getAllCombinationEntries = false): { [key: string]: any } {
    const res: { [key: string]: any } = {};

    if (getAllCombinationEntries) res['/document'] = document;

    const getEntriesDeep = (entries: [string, any][], path: string) => {
      entries.forEach(entry => {
        const key = entry[0];
        const val = entry[1];
        if (typeof val === 'object') {
          getEntriesDeep(Object.entries(val), path + key + '/');
          if (getAllCombinationEntries) res[path + key] = val;
        } else res[path + key] = val;
      }, []);
    };

    getEntriesDeep(Object.entries(document), '/document/');
    return res;
  }

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

  async update(id: string, updateIoTprojectDto: IoTProjectUpdateDTO) {
    return await this.projectRepository.save({ id, ...updateIoTprojectDto });
  }

  async remove(id: string) {
    return await this.projectRepository.delete(id);
  }

  async updateLayout(id: string, layout: IoTProjectLayout) {
    const project = await this.findOne(id);

    layout.components = layout.components.filter((c: any) => c != null && JSON.stringify(c) != '{}');

    const watchers = WatcherClient.getClientsByProject(id);

    const data: IoTUpdateLayoutRequestToWatcher = {
      layout,
    };
    watchers.forEach(w => w.sendCustom('layout_update', data));

    return await this.projectRepository.save({ ...project, layout });
  }

  async setDocument(id: string, document: IoTProjectDocument, oldDocument?: IoTProjectDocument) {
    if (!oldDocument) {
      const project = await this.findOne(id);
      oldDocument = project.document;
    }

    // SEND TO WATCHERS
    const watchers = WatcherClient.getClientsByProject(id);

    const data: IoTUpdateDocumentRequestToWatcher = {
      doc: document,
    };
    watchers.forEach(w => w.sendCustom('document_update', data));

    // DETECT CHANGES IN DOCUMENT
    const entriesOld = this.getDocumentEntries(oldDocument, true);
    const entriesNew = this.getDocumentEntries(document, true);

    const updatedFields = {};

    Object.entries(entriesNew).forEach(entry => {
      const key = entry[0];
      const val = entry[1];
      if (!(key in entriesOld) || (typeof val !== 'object' && !Array.isArray(val) && entriesOld[key] !== val)) {
        const pathParts = key.split('/');
        for (let i = 2; i < pathParts.length; i++) {
          const path = pathParts.slice(0, i).join('/');
          updatedFields[path] = entriesNew[path];
        }
        updatedFields[key] = val;
      }
    });

    console.log('\n\n\n');
    console.log(updatedFields);
    console.log('\n\n\n');

    // SEND CHANGES DETECTED TO OBJECTS LISTENING
    ObjectClient.sendToListeners(id, updatedFields);

    // SAVE PROJECT
    return await this.projectRepository.save({ id, document });
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

  async getProjectOrProgression(id: string): Promise<IoTProjectEntity | LevelProgressionEntity> {
    if (id.includes('/')) {
      const split = id.split('/');
      if (split.length < 2) throw new HttpException('Bad Id', HttpStatus.BAD_REQUEST);
      try {
        return await this.levelService.getIoTProgressionById(split[0], split[1]);
      } catch {
        throw new HttpException('Project id not found', HttpStatus.NOT_FOUND);
      }
    } else {
      return await this.findOne(id);
    }
  }

  async sendRoute(route: IoTRouteEntity, data: any) {
    await this.asScriptService.compileBackend({ lines: route.asScript.content }, data);
  }

  async updateDocument(id: string, fields: JsonObj) {
    const project = await this.findOne(id);
    const document = { ...project.document, ...fields };

    this.setDocument(id, document, project.document);
  }

  async getDocument(id: string) {
    return (await this.findOne(id)).document;
  }

  async updateComponent(id: string, componentId: string, value: any, sendUpdate = false): Promise<void> {
    const projectOrProgression = await this.getProjectOrProgression(id);

    const layoutManager = projectOrProgression.getLayoutManager();
    layoutManager.updateComponent(componentId, value);

    if (projectOrProgression instanceof IoTProjectEntity) {
      await this.projectRepository.save(projectOrProgression);
    } else {
      await this.progressionRepo.save(projectOrProgression);
    }

    if (sendUpdate) {
      const watchers = WatcherClient.getClientsByProject(id);

      const data: IoTUpdateRequestToWatcher = {
        id: componentId,
        value,
      };

      watchers.forEach(w => w.sendCustom('update', data));
    }
  }

  async getComponentValue(id: string, componentId: string) {
    const projectOrProgression = await this.getProjectOrProgression(id);

    const layoutManager = projectOrProgression.getLayoutManager();
    return layoutManager.getComponentValue(componentId);
  }
}
