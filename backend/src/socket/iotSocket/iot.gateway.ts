import { Logger, UseInterceptors, Controller, Body, HttpException, HttpStatus, Post, UseFilters } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import {
  IoTActionRequestFromWatcher,
  IoTUpdateRequestFromObject,
  IoTRouteRequestFromObject,
  IoTUpdateDocumentRequestFromObject,
  IoTGetDocRequestFromObject,
  IOT_EVENT,
  Client,
} from './iotSocket.types';
import { IoTObjectService } from '../../models/iot/IoTobject/IoTobject.service';
import { DTOInterceptor } from '../../utils/interceptors/dto.interceptor';
import { IoTObjectEntity } from '../../models/iot/IoTobject/entities/IoTobject.entity';
import { IoTProjectService } from '../../models/iot/IoTproject/IoTproject.service';
import {
  WatcherClient,
  WatcherClientConnectPayload,
  ObjectClientConnectPayload,
  ObjectClient,
  IoTActionDoneRequestFromObject,
  IoTActionDoneRequestToWatcher,
} from './iotSocket.types';
import { IoTExceptionFilter } from './iot.exception';
import {
  IoTListenRequestFromObject,
  IoTGetFieldRequestFromObject,
  IoTBroadcastRequestFromBoth,
} from './iotSocket.types';

@UseInterceptors(DTOInterceptor)
@WebSocketGateway(8881)
@Controller('iot/aliot')
export class IoTGateway implements OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit {
  private logger: Logger = new Logger('IoTGateway');

  constructor(private iotObjectService: IoTObjectService, private iotProjectService: IoTProjectService) {}

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log(`Initialized`);

    // Set the ping interval to ping each connected object (each 15 seconds)
    setInterval(() => {
      Client.getClients().forEach(client => {
        // Client still hasn't responded to the ping, it is presumed dead
        if (!client.isAlive) {
          client.removeClient();
          return client.getSocket().terminate();
        }

        // Client is ping to see if it is still alive
        client.isAlive = false;
        client.getSocket().ping();
        client.sendEvent(IOT_EVENT.PING, null);
      });
    }, 15000); // Each 15 secondes
  }

  handleConnection() {
    this.logger.log(`Client connected`);
  }

  receivePong(socket: WebSocket) {
    const client = Client.getClientBySocket(socket);
    if (client) client.isAlive = true;
  }

  async handleDisconnect(@ConnectedSocket() socket: WebSocket) {
    this.logger.log(`Client disconnected`);
    const client = Client.getClientBySocket(socket);
    if (client instanceof ObjectClient) {
      const object = await this.iotObjectService.findOne(client.id);
      await this.iotObjectService.addIoTObjectLog(object, IOT_EVENT.DISCONNECT_OBJECT, 'Disconnected from ALIVEcode');
    }
    Client.removeClientBySocket(socket);
  }

  @SubscribeMessage(IOT_EVENT.PONG)
  pong(@ConnectedSocket() socket: WebSocket) {
    this.receivePong(socket);
  }

  @UseFilters(new IoTExceptionFilter())
  @SubscribeMessage(IOT_EVENT.CONNECT_WATCHER)
  async connectWatcher(@ConnectedSocket() socket: WebSocket, @MessageBody() payload: WatcherClientConnectPayload) {
    if (!payload.iotProjectId || !payload.userId || !payload.iotProjectName) throw new WsException('Bad payload');
    if (WatcherClient.isSocketAlreadyWatcher(socket)) throw new WsException('Already connected as a watcher');
    const alreadyConnectedSocket = WatcherClient.getClientBySocket(socket);
    if (alreadyConnectedSocket) alreadyConnectedSocket.getSocket().terminate();

    // TODO : User token verification
    const isCreator = await this.iotProjectService.isUserProjectCreator(payload.userId, payload.iotProjectId);

    const client = new WatcherClient(socket, payload.userId, payload.iotProjectId, isCreator);
    client.register();

    this.logger.log(
      `Watcher connected and listening on project : ${payload.iotProjectName} id : ${payload.iotProjectId}`,
    );

    client.sendEvent(IOT_EVENT.CONNECT_SUCCESS, 'Watcher connected');
  }

  @UseFilters(new IoTExceptionFilter())
  @SubscribeMessage(IOT_EVENT.CONNECT_OBJECT)
  async connectObject(@ConnectedSocket() socket: WebSocket, @MessageBody() payload: ObjectClientConnectPayload) {
    if (!payload.id) throw new WsException('Bad payload');
    if (WatcherClient.isSocketAlreadyWatcher(socket)) throw new WsException('Already connected as a watcher');
    const alreadyConnectedObj = ObjectClient.getClientById(payload.id);
    if (alreadyConnectedObj) throw new WsException(`An IoTObject is already connected with the id "${payload.id}"`);

    // Checks if the object exists in the database and checks for permissions for projects
    let iotObject: IoTObjectEntity;
    try {
      iotObject = await this.iotObjectService.findOne(payload.id);
    } catch (err) {
      throw new WsException(`Objet with id "${payload.id}" is not registered on ALIVEcode`);
    }

    // Register client
    const projectId = iotObject.currentIoTProjectId;
    const client = new ObjectClient(socket, payload.id, projectId);
    client.register();

    // Logging
    this.logger.log(`IoTObject connect with id : ${payload.id}`);

    await this.iotObjectService.addIoTObjectLog(iotObject, IOT_EVENT.CONNECT_SUCCESS, 'Connected to ALIVEcode');

    client.sendEvent(IOT_EVENT.CONNECT_SUCCESS, null);
  }

  @UseFilters(new IoTExceptionFilter())
  @SubscribeMessage(IOT_EVENT.UPDATE_COMPONENT)
  async sendUpdate(@ConnectedSocket() socket: WebSocket, @MessageBody() payload: IoTUpdateRequestFromObject) {
    if (!payload.id || payload.value == null) throw new WsException('Bad payload');
    const client = ObjectClient.getClientBySocket(socket);
    if (!client) throw new WsException('Forbidden');
    if (!client.projectId)
      throw new WsException(
        'Your object is not connected to any project on ALIVEcode. Make sure to add the object inside one of your IoTProject and click the connect button.',
      );

    const object = await this.iotObjectService.findOne(client.id);
    await this.iotObjectService.addIoTObjectLog(
      object,
      IOT_EVENT.UPDATE_COMPONENT,
      `Updated interface component of id "${payload.id}" using "${JSON.stringify(payload.value)}"`,
    );

    await this.iotProjectService.updateComponent(client.projectId, payload.id, payload.value);
  }

  @UseFilters(new IoTExceptionFilter())
  @SubscribeMessage(IOT_EVENT.UPDATE_DOC)
  async update(@ConnectedSocket() socket: WebSocket, @MessageBody() payload: IoTUpdateDocumentRequestFromObject) {
    if (payload.fields == null || typeof payload.fields !== 'object') throw new WsException('Bad payload');
    const client = Client.getClientBySocket(socket);
    if (!client) throw new WsException('Forbidden');
    if (!client.projectId)
      throw new WsException(
        'Your object is not connected to any project on ALIVEcode. Make sure to add the object inside one of your IoTProject and click the connect button.',
      );

    if (client instanceof ObjectClient) {
      const object = await this.iotObjectService.findOne(client.id);
      await this.iotObjectService.addIoTObjectLog(
        object,
        IOT_EVENT.UPDATE_DOC,
        `Updated document using "${JSON.stringify(payload.fields)}"`,
      );
    }

    await this.iotProjectService.updateDocumentFields(client.projectId, payload.fields);
  }

  @UseFilters(new IoTExceptionFilter())
  @SubscribeMessage(IOT_EVENT.SUBSCRIBE_LISTENER)
  async listen(@ConnectedSocket() socket: WebSocket, @MessageBody() payload: IoTListenRequestFromObject) {
    if (!Array.isArray(payload.fields)) throw new WsException('Bad payload');
    const client = Client.getClientBySocket(socket);
    if (!client) throw new WsException('Forbidden');

    const fields = payload.fields.filter(f => typeof f === 'string');

    if (client instanceof ObjectClient) {
      const object = await this.iotObjectService.findOne(client.id);
      await this.iotObjectService.subscribeListenerObject(object, fields);
    } else if (client instanceof WatcherClient) {
      await this.iotObjectService.subscribeListenerUser(client.id, fields);
    }
  }

  @UseFilters(new IoTExceptionFilter())
  @SubscribeMessage(IOT_EVENT.SEND_ACTION)
  async sendObject(@ConnectedSocket() socket: WebSocket, @MessageBody() payload: IoTActionRequestFromWatcher) {
    if (!payload.targetId || payload.actionId == null || payload.value == null) throw new WsException('Bad payload');
    const watcher = WatcherClient.getClientBySocket(socket);
    if (!watcher) throw new WsException('Forbidden');

    const object = await this.iotObjectService.findOneWithLoadedProject(payload.targetId);
    if (object.currentIotProject?.id !== watcher.projectId) throw new WsException('Not in the same project');

    await this.iotObjectService.sendAction(object, payload.actionId, payload.value);
  }

  @UseFilters(new IoTExceptionFilter())
  @SubscribeMessage(IOT_EVENT.SEND_ACTION_DONE)
  async sendActionDone(@ConnectedSocket() socket: WebSocket, @MessageBody() payload: IoTActionDoneRequestFromObject) {
    if (payload.actionId == null) throw new WsException('Bad payload');
    const client = ObjectClient.getClientBySocket(socket);
    if (!client) throw new WsException('Forbidden');

    const object = await this.iotObjectService.findOne(client.id);

    await this.iotObjectService.addIoTObjectLog(
      object,
      IOT_EVENT.SEND_ACTION_DONE,
      `Object finished action with id "${payload.actionId}"${
        payload.value == null ? '.' : ` with value "${JSON.stringify(payload.value)}".`
      }`,
    );

    const data: IoTActionDoneRequestToWatcher = {
      actionId: payload.actionId,
      targetId: client.id,
      value: payload.value,
    };
    WatcherClient.getClients().map(c => c.sendEvent(IOT_EVENT.RECEIVE_ACTION_DONE, data));
  }

  @UseFilters(new IoTExceptionFilter())
  @SubscribeMessage(IOT_EVENT.SEND_ROUTE)
  async sendRoute(@ConnectedSocket() socket: WebSocket, @MessageBody() payload: IoTRouteRequestFromObject) {
    if (!payload.routePath || !payload.data) throw new WsException('Bad payload');
    const client = ObjectClient.getClientBySocket(socket);
    if (!client) throw new WsException('Forbidden');
    if (!client.projectId)
      throw new WsException(
        'Your object is not connected to any project on ALIVEcode. Make sure to add the object inside one of your IoTProject and click the connect button.',
      );

    const { route } = await this.iotProjectService.findOneWithRoute(client.projectId, payload.routePath);

    const object = await this.iotObjectService.findOne(client.id);
    await this.iotObjectService.addIoTObjectLog(
      object,
      IOT_EVENT.SEND_ROUTE,
      `Sent route execution request for route "${route.path}" with context "${JSON.stringify(payload.data)}"`,
    );

    await this.iotProjectService.sendRoute(route, payload.data);
  }

  @UseFilters(new IoTExceptionFilter())
  @SubscribeMessage(IOT_EVENT.SEND_BROADCAST)
  async broadcast(@ConnectedSocket() socket: WebSocket, @MessageBody() payload: IoTBroadcastRequestFromBoth) {
    if (!payload.data) throw new WsException('Bad payload');
    const client = ObjectClient.getClientBySocket(socket);
    if (!client) throw new WsException('Forbidden');
    if (!client.projectId)
      throw new WsException(
        'Your object is not connected to any project on ALIVEcode. Make sure to add the object inside one of your IoTProject and click the connect button.',
      );

    const object = await this.iotObjectService.findOne(client.id);
    await this.iotObjectService.addIoTObjectLog(
      object,
      IOT_EVENT.SEND_BROADCAST,
      `Sent broadcast using "${JSON.stringify(payload.data)}"`,
    );

    const project = await this.iotProjectService.findOne(client.projectId);
    await this.iotProjectService.broadcast(project, payload.data);
  }

  /*****   HTTP PROTOCOLS   *****/

  @Post(IOT_EVENT.GET_DOC)
  async getAll(@Body() payload: IoTGetDocRequestFromObject) {
    if (!payload.id) throw new HttpException('Bad payload', HttpStatus.BAD_REQUEST);
    const client = Client.getClientById(payload.id);
    if (!client) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    if (!client.projectId)
      throw new HttpException(
        'Your object is not connected to any project on ALIVEcode. Make sure to add the object inside one of your IoTProject and click the connect button.',
        HttpStatus.FORBIDDEN,
      );

    if (client instanceof ObjectClient) {
      const object = await this.iotObjectService.findOne(client.id);
      await this.iotObjectService.addIoTObjectLog(object, IOT_EVENT.SEND_BROADCAST, `Retrieved document of project`);
    }

    return await this.iotProjectService.getDocument(client.projectId);
  }

  @Post(IOT_EVENT.GET_FIELD)
  async getField(@Body() payload: IoTGetFieldRequestFromObject) {
    if (!payload.id || !payload.field) throw new HttpException('Bad payload', HttpStatus.BAD_REQUEST);
    const client = Client.getClientById(payload.id);
    if (!client) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    if (!client.projectId)
      throw new HttpException(
        'Your object is not connected to any project on ALIVEcode. Make sure to add the object inside one of your IoTProject and click the connect button.',
        HttpStatus.FORBIDDEN,
      );

    if (client instanceof ObjectClient) {
      const object = await this.iotObjectService.findOne(client.id);
      await this.iotObjectService.addIoTObjectLog(
        object,
        IOT_EVENT.GET_FIELD,
        `Retrieved field "${payload.field}" from project`,
      );
    }

    return await this.iotProjectService.getField(client.projectId, payload.field);
  }
}
