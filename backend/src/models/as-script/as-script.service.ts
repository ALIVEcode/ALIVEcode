import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { CompileDTO } from './dto/compile.dto';
import axios from 'axios';
import LevelIoTBackendExecutor from './LevelIoTBackendExecutor';
import { IoTProjectService } from '../iot/IoTproject/IoTproject.service';
import { InjectRepository } from '@nestjs/typeorm';
import { AsScriptEntity } from './entities/as-script.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AsScriptService {
  constructor(
    @InjectRepository(AsScriptEntity) private asScriptRepo: Repository<AsScriptEntity>,
    private iotProjectService: IoTProjectService,
  ) {}

  async sendDataToAsServer(data: any, context?: any) {
    if (context) data.context = context;
    let res: AxiosResponse;
    try {
      res = await axios({
        method: 'POST',
        url: '/compile/',
        baseURL: process.env.AS_URL,
        data,
      });
    } catch (err) {
      console.error(err);
      throw new HttpException('AliveScript service crashed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return res.data;
  }

  async compile(compileDto: CompileDTO) {
    const { backendCompiling, ...data } = compileDto;

    if (backendCompiling) return await this.compileBackend(data);

    return await this.sendDataToAsServer(data);
  }

  async compileBackend(data: any, context: any = undefined) {
    const res = await this.sendDataToAsServer(data, context);
    const executor = new LevelIoTBackendExecutor(this, this.iotProjectService, res.result);
    await executor.toggleExecution();

    if (res.result) {
      const index = res.result.findIndex((action: any) => action.id === 0);
      res.result.splice(index >= 0 ? index : res.result.length, 0, ...executor.getActionsResponse());
    }

    return res;
  }

  findAll() {
    return `This action returns all asScript`;
  }

  async findOne(id: string) {
    const script = await this.asScriptRepo.findOne(id);
    if (!script) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return script;
  }

  async updateContent(script: AsScriptEntity, content: string) {
    return await this.asScriptRepo.save({ ...script, content });
  }

  remove(id: number) {
    return `This action removes a #${id} asScript`;
  }
}
