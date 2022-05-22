import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { CompileDTO } from './dto/compile.dto';
import axios from 'axios';
import ChallengeIoTBackendExecutor from './ChallengeIoTBackendExecutor';
import { IoTProjectService } from '../iot/IoTproject/IoTproject.service';
import { InjectRepository } from '@nestjs/typeorm';
import { AsScriptEntity } from './entities/as-script.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { IoTProjectEntity } from '../iot/IoTproject/entities/IoTproject.entity';

@Injectable()
export class AsScriptService {
  constructor(
    @InjectRepository(AsScriptEntity) private asScriptRepo: Repository<AsScriptEntity>,
    private iotProjectService: IoTProjectService,
  ) {}

  async sendDataToAsServer(data: any, query?: { [name: string]: string }, context?: any) {
    if (context) data.context = context;
    const queryString =
      query &&
      '?' +
        Object.entries(query)
          .map(([name, value]) => `${name}=${value}`)
          .join('&');
    let res: AxiosResponse;
    try {
      res = await axios({
        method: 'POST',
        url: `/compile${queryString ?? '/'}`,
        baseURL: process.env.AS_URL,
        data,
      });
    } catch (err) {
      console.error(err);
      throw new HttpException('AliveScript service crashed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return res.data;
  }

  async compile(compileDto: CompileDTO, query?: { [name: string]: string }) {
    const { backendCompiling, ...data } = compileDto;

    if (backendCompiling) return await this.compileBackend(data, query);

    return await this.sendDataToAsServer(data, query);
  }

  async compileBackend(data: any, query?: { [name: string]: string }, context: any = undefined) {
    const res = await this.sendDataToAsServer(data, query, context);
    const executor = new ChallengeIoTBackendExecutor(this, this.iotProjectService, res.result);
    await executor.toggleExecution();

    if (res.result) {
      const index = res.result.findIndex((action: any) => action.id === 0);
      res.result.splice(index >= 0 ? index : res.result.length, 0, ...executor.getActionsResponse());
    }

    return res;
  }

  findAll() {
    throw new HttpException('Not implemented', HttpStatus.NOT_IMPLEMENTED);
  }

  async findByIoTProject(project: IoTProjectEntity) {
    return await this.asScriptRepo.find({ where: { iotProjectId: project.id }, order: { updateDate: 'DESC' } });
  }

  async findOneByIoTProject(id: string, project: IoTProjectEntity) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const script = await this.asScriptRepo.findOne({ where: { id, iotProjectId: project.id } });
    if (!script) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return script;
  }

  async findOne(id: string) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const script = await this.asScriptRepo.findOne(id);
    if (!script) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return script;
  }

  async updateContent(script: AsScriptEntity, content: string) {
    return await this.asScriptRepo.save({ ...script, content });
  }

  async create(creator: UserEntity, dto: AsScriptEntity) {
    delete dto['id'];
    return await this.asScriptRepo.save({ ...dto, creator });
  }

  remove(id: number) {
    return `This action removes a #${id} asScript`;
  }
}
