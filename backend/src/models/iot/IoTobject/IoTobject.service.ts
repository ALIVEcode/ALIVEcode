import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IoTLog, IoTObjectEntity } from './entities/IoTobject.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { IoTSendActionRequestToObject, IOT_EVENT, ObjectClient } from '../../../socket/iotSocket/iotSocket.types';

@Injectable()
export class IoTObjectService {
  constructor(@InjectRepository(IoTObjectEntity) private objectRepository: Repository<IoTObjectEntity>) {}

  async create(creator: UserEntity, createIoTObjectDto: IoTObjectEntity) {
    const iotObject = this.objectRepository.create(createIoTObjectDto);
    iotObject.creator = creator;
    return await this.objectRepository.save(iotObject);
  }

  async findAll() {
    return await this.objectRepository.find();
  }

  async findOne(id: string) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const iotObject = await this.objectRepository.findOne(id);
    if (!iotObject) throw new HttpException('IoTObject not found', HttpStatus.NOT_FOUND);
    return iotObject;
  }

  async findOneWithLoadedProjects(id: string) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const iotObject = await this.objectRepository
      .createQueryBuilder('iotObject')
      .where('iotObject.id = :id', { id })
      .leftJoinAndSelect('iotObject.currentIotProject', 'iotProject')
      .getOne();
    if (!iotObject) throw new HttpException('IoTObject not found', HttpStatus.NOT_FOUND);
    return iotObject;
  }

  async update(id: string, updateIoTobjectDto: IoTObjectEntity) {
    return await this.objectRepository.save({ ...updateIoTobjectDto, id });
  }

  async remove(id: string) {
    return await this.objectRepository.delete(id);
  }

  async getCurrentClient(object: IoTObjectEntity) {
    const client = ObjectClient.getClientById(object.id);
    if (!client) throw new HttpException('IoTObject is not connected', HttpStatus.NOT_FOUND);
    return client;
  }

  /**
   * Adds a log to an iotobject. removes logs if it exceeds 100.
   * @param object Object to add a log to
   * @param event Name of the event that occured
   * @param text Text of the log
   * @returns The updated IoTObject with the new log
   */
  async addIoTObjectLog(object: IoTObjectEntity, event: IOT_EVENT, text: string, save = true) {
    if (!object.logs) object.logs = [];
    else if (object.logs.length > 100) object.logs.shift();
    const log = new IoTLog(event, text);
    object.logs.push(log);

    return save ? await this.objectRepository.save(object) : object;
  }

  /**
   * Sends a request for an action to an IoTObject
   * @param object Object to send the action request to
   * @param actionId Id of the action to send
   * @param value Value of the action
   */
  async sendAction(object: IoTObjectEntity, actionId: string, value: any) {
    const client = ObjectClient.getClientById(object.id);
    if (!client) throw new HttpException('Object is not connected', HttpStatus.NOT_FOUND);

    const req: IoTSendActionRequestToObject = {
      event: IOT_EVENT.RECEIVE_ACTION,
      data: {
        id: actionId,
        value,
      },
    };

    client.sendEvent(req.event, req.data);
  }

  async subscribeListener(object: IoTObjectEntity, fields: string[]) {
    const client = await this.getCurrentClient(object);

    client.listen(fields);
    this.addIoTObjectLog(object, IOT_EVENT.SUBSCRIBE_LISTENER, `Subscribed listener for document fields : ${fields}`);
    client.sendEvent(IOT_EVENT.SUBSCRIBE_LISTENER_SUCCESS, null);
  }
}
