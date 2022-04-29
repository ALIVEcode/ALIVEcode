import { Injectable, HttpException, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IoTProjectEntity, IoTProjectLayout, IoTProjectDocument, JsonObj } from './entities/IoTproject.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { IoTRouteEntity } from '../IoTroute/entities/IoTroute.entity';
import {
  Client,
  IoTBroadcastRequestToObject,
  IoTUpdateDocumentRequestToWatcher,
  IoTUpdateRequestToWatcher,
  IOT_EVENT,
  WatcherClient,
} from '../../../socket/iotSocket/iotSocket.types';
import { validUUID } from '../../../utils/types/validation.types';
import { AsScriptEntity } from '../../as-script/entities/as-script.entity';
import { AsScriptService } from '../../as-script/as-script.service';
import { ChallengeService } from '../../challenge/challenge.service';
import { ChallengeProgressionEntity } from '../../challenge/entities/challenge_progression.entity';
import { IoTProjectUpdateDTO } from './dto/updateProject.dto';
import { IoTUpdateLayoutRequestToWatcher, ObjectClient } from '../../../socket/iotSocket/iotSocket.types';
import { IoTProjectObjectEntity } from './entities/IoTprojectObject.entity';
import { IoTObjectEntity } from '../IoTobject/entities/IoTobject.entity';
import { IoTObjectService } from '../IoTobject/IoTobject.service';

@Injectable()
export class IoTProjectService {
  constructor(
    @InjectRepository(IoTProjectEntity) private projectRepository: Repository<IoTProjectEntity>,
    @InjectRepository(IoTRouteEntity) private routeRepository: Repository<IoTRouteEntity>,
    @InjectRepository(AsScriptEntity) private scriptRepo: Repository<AsScriptEntity>,
    @InjectRepository(ChallengeProgressionEntity) private progressionRepo: Repository<ChallengeProgressionEntity>,
    @InjectRepository(IoTObjectEntity) private objRepo: Repository<IoTObjectEntity>,
    @InjectRepository(IoTProjectObjectEntity) private projectObjRepo: Repository<IoTProjectObjectEntity>,
    private challengeService: ChallengeService,
    @Inject(forwardRef(() => AsScriptService)) private asScriptService: AsScriptService,
    @Inject(forwardRef(() => IoTObjectService)) private objService: IoTObjectService,
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
    if (!project) throw new HttpException(`IoTProject with id "${id}" found`, HttpStatus.NOT_FOUND);
    return project;
  }

  async findOneWithRoute(projectId: string, routePath: string) {
    if (!projectId || !validUUID(projectId) || !routePath)
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const project = await this.projectRepository.findOne(projectId, { relations: ['routes'] });
    if (!project) throw new HttpException('IoTProject not found', HttpStatus.NOT_FOUND);

    const route = project.routes.find(r => r.path === routePath);
    if (!route) throw new HttpException('Route not found', HttpStatus.NOT_FOUND);

    return { route, project };
  }

  async update(id: string, updateIoTprojectDto: IoTProjectUpdateDTO) {
    return await this.projectRepository.save({ ...updateIoTprojectDto, id });
  }

  async remove(id: string) {
    return await this.projectRepository.delete(id);
  }

  async updateLayout(id: string, layout: IoTProjectLayout, issuer?: WatcherClient) {
    const project = await this.findOne(id);

    layout.components = layout.components.filter((c: any) => c != null && JSON.stringify(c) != '{}');

    const watchers = issuer
      ? WatcherClient.getClientsByProject(id).filter(c => c.getSocket() !== issuer.getSocket())
      : WatcherClient.getClientsByProject(id);

    const data: IoTUpdateLayoutRequestToWatcher = {
      layout,
    };
    watchers.forEach(w => w.sendEvent(IOT_EVENT.RECEIVE_INTERFACE, data));

    return await this.projectRepository.save({ ...project, layout });
  }

  async setDocument(id: string, document: IoTProjectDocument) {
    const project = await this.findOne(id);
    const oldDocument = project.document;

    // SEND TO WATCHERS
    const watchers = WatcherClient.getClientsByProject(id);

    const data: IoTUpdateDocumentRequestToWatcher = {
      doc: document,
    };
    watchers.forEach(w => w.sendEvent(IOT_EVENT.RECEIVE_DOC, data));

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

    // SEND CHANGES DETECTED TO OBJECTS LISTENING
    await Client.sendToListeners(id, updatedFields, this.objService);

    // SAVE PROJECT
    return await this.projectRepository.save({ document, id });
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
    return await this.projectObjRepo.find({ where: { iotProjectId: project.id } });
  }

  async getScripts(project: IoTProjectEntity) {
    return await this.asScriptService.findByIoTProject(project);
  }

  async addObject(project: IoTProjectEntity, object: IoTObjectEntity) {
    const projectObject = this.projectObjRepo.create({ iotObject: object, iotProject: project });

    if (!Array.isArray(project.iotProjectObjects))
      project = await this.projectRepository.findOne(project.id, { relations: ['iotProjectObjects'] });

    if (project.iotProjectObjects.find(obj => obj.iotObjectId === object.id) != null)
      throw new HttpException('Object already inside project', HttpStatus.CONFLICT);

    await this.projectObjRepo.save(projectObject);
    project.iotProjectObjects.push(projectObject);
    await this.projectRepository.save(project);
    return projectObject;
  }

  async addScriptToRoute(project: IoTProjectEntity, routeId: string, script: AsScriptEntity) {
    project = await this.projectRepository.findOne(project.id, { relations: ['routes'] });

    const route = project.routes.find(r => r.id === routeId);
    if (!route) throw new HttpException('No route found', HttpStatus.NOT_FOUND);

    route.asScript = script;

    await this.routeRepository.save(route);
    return script;
  }

  async addScriptToProject(project: IoTProjectEntity, script: AsScriptEntity) {
    if (!Array.isArray(project.scripts))
      project = await this.projectRepository.findOne(project.id, { relations: ['scripts'] });

    await this.projectRepository.save(project);
    return script;
  }

  async setScriptOfObject(object: IoTProjectObjectEntity, script: AsScriptEntity) {
    object.script = script;
    return await this.projectObjRepo.save(object);
  }

  async getProjectOrProgression(id: string): Promise<IoTProjectEntity | ChallengeProgressionEntity> {
    return await this.findOne(id);

    /*
		if (id.includes('/')) {
			const split = id.split('/');
			if (split.length < 2) throw new HttpException('Bad Id', HttpStatus.BAD_REQUEST);
			try {
				return await this.challengeService.getIoTProgressionById(split[0], split[1]);
			} catch {
				throw new HttpException('Project id not found', HttpStatus.NOT_FOUND);
			}
		} else {
			return await this.findOne(id);
		}*/
  }

  async sendRoute(route: IoTRouteEntity, data: any) {
    // TODO ADD query support
    await this.asScriptService.compileBackend({ lines: route.asScript.content }, {}, data);
  }

  async updateDocument(id: string, fields: JsonObj) {
    const project = await this.findOne(id);
    const document = { ...project.document, ...fields };

    return await this.setDocument(id, document);
  }

  async updateDocumentFields(id: string, fields: JsonObj) {
    const project = await this.findOne(id);
    const newDoc = project.document;

    Object.entries(fields).forEach(entry => {
      const path = entry[0];
      const value = entry[1];

      // Cut the /document/ of the path and add in array
      const pathParts = path.split('/').slice(2);
      const nbPathParts = pathParts.length;

      const recursiveSetter = (currentDict: object, pathParts: string[], depth: number) => {
        if (typeof currentDict !== 'object') {
          currentDict = {};
        }

        if (depth + 1 === nbPathParts) {
          currentDict[pathParts[depth]] = value;
          return currentDict;
        }

        currentDict[pathParts[depth]] = recursiveSetter(currentDict[pathParts[depth]], pathParts, depth + 1);
        return currentDict;
      };

      recursiveSetter(newDoc, pathParts, 0);
    });

    return await this.setDocument(id, newDoc);
  }

  async getDocument(projectId: string) {
    return (await this.findOne(projectId)).document;
  }

  async getField(projectId: string, field: string) {
    const doc = await this.getDocument(projectId);
    const entries = this.getDocumentEntries(doc, true);

    return field in entries ? entries[field] : null;
  }

  async updateComponent(
    id: string,
    componentId: string,
    value: any,
    sendUpdate = true,
    issuer?: WatcherClient,
  ): Promise<void> {
    const projectOrProgression = await this.getProjectOrProgression(id);

    const layoutManager = projectOrProgression.getLayoutManager();
    layoutManager.updateComponent(componentId, value);

    if (projectOrProgression instanceof IoTProjectEntity) {
      await this.projectRepository.save(projectOrProgression);
    } else {
      await this.progressionRepo.save(projectOrProgression);
    }

    if (sendUpdate) {
      const watchers = issuer
        ? WatcherClient.getClientsByProject(id).filter(c => c.getSocket() !== issuer.getSocket())
        : WatcherClient.getClientsByProject(id);

      const data: IoTUpdateRequestToWatcher = {
        id: componentId,
        value,
      };

      watchers.forEach(w => w.sendEvent(IOT_EVENT.RECEIVE_UPDATE_COMPONENT, data));
    }
  }

  async findProjectObject(id: string, project: IoTProjectEntity) {
    if (!id) return;
    const obj = await this.projectObjRepo.findOne({ where: { id, iotProjectId: project.id } });
    if (!obj) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return obj;
  }

  /**
   * Sends a broadcast to every IoTObject currently connected to a specified project
   * @param project Project to broadcast on
   * @param data Data to broadcast
   */
  async broadcast(project: IoTProjectEntity, data: any) {
    const req: IoTBroadcastRequestToObject = {
      event: IOT_EVENT.RECEIVE_BROADCAST,
      data: {
        data,
      },
    };

    const objects = ObjectClient.getClientsByProject(project.id);
    objects.map(o => o.sendEvent(req.event, req.data));
  }

  async isUserProjectCreator(userId: string, projectId: string) {
    return (await this.projectRepository.find({ where: { id: projectId, creatorId: userId } })) != null;
  }

  async getComponentValue(id: string, componentId: string) {
    const projectOrProgression = await this.getProjectOrProgression(id);

    const layoutManager = projectOrProgression.getLayoutManager();
    return layoutManager.getComponentValue(componentId);
  }
}
