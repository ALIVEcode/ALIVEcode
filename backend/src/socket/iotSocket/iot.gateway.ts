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
} from './iotSocket.types';
import { IOTPROJECT_INTERACT_RIGHTS } from '../../models/iot/IoTproject/entities/IoTproject.entity';
import { IoTBroadcastRequestToObject } from './iotSocket.types';
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
      });
    }, 15000); // Each 15 secondes
  }

  handleConnection(ws: WebSocket) {
    this.logger.log(`Client connected`);

    /** Register pong action for client socket */
    ws.on('pong', this.receivePong);
  }

  receivePong(socket: WebSocket) {
    const client = Client.getClientBySocket(socket);
    if (client) client.isAlive = true;
  }

  handleDisconnect(@ConnectedSocket() socket: WebSocket) {
    this.logger.log(`Client disconnected`);
    Client.removeClientBySocket(socket);
  }

  @SubscribeMessage('pong')
  pong(@ConnectedSocket() socket: WebSocket) {
    this.receivePong(socket);
  }

  @UseFilters(new IoTExceptionFilter())
  async objectPermissionFilter(socket: WebSocket, projectId: string) {
    const object = ObjectClient.getClientBySocket(socket);
    if (!object) throw new WsException('Forbidden');

    try {
      const project = await this.iotProjectService.findOne(projectId);

      if (project.interactRights !== IOTPROJECT_INTERACT_RIGHTS.ANYONE && !object.hasProjectRights(projectId))
        throw new WsException(`You don't have the rights to interact with project "${projectId}"`);

      return { project, object };
    } catch (err) {
      if (err instanceof HttpException) {
        if (err.getStatus() == HttpStatus.BAD_REQUEST)
          throw new WsException(`Id "${projectId}" is not a valid project id.`);
      }
      throw err;
    }
  }

  @UseFilters(new IoTExceptionFilter())
  @SubscribeMessage('connect_watcher')
  connect_watcher(@ConnectedSocket() socket: WebSocket, @MessageBody() payload: WatcherClientConnectPayload) {
    if (!payload.iotProjectId || !payload.iotProjectName) throw new WsException('Bad payload');
    if (WatcherClient.isSocketAlreadyWatcher(socket)) throw new WsException('Already connected as a watcher');

    const client = new WatcherClient(socket, payload.iotProjectId);
    client.register();

    this.logger.log(
      `Watcher connected and listening on project : ${payload.iotProjectName} id : ${payload.iotProjectId}`,
    );

    client.sendEvent('connect-success', 'Watcher connected');
  }

  @UseFilters(new IoTExceptionFilter())
  @SubscribeMessage('connect_object')
  async connect_object(@ConnectedSocket() socket: WebSocket, @MessageBody() payload: ObjectClientConnectPayload) {
    if (!payload.id) throw new WsException('Bad payload');
    if (WatcherClient.isSocketAlreadyWatcher(socket)) throw new WsException('Already connected as a watcher');
    const alreadyConnectedObj = ObjectClient.getClientById(payload.id);
    if (alreadyConnectedObj) throw new WsException(`An IoTObject is already connected with the id "${payload.id}"`);

    // Checks if the object exists in the database and checks for permissions for projects
    let iotObject: IoTObjectEntity;
    try {
      iotObject = await this.iotObjectService.findOneWithLoadedProjects(payload.id);
    } catch (err) {
      throw new WsException(`Objet with id "${payload.id}" is not registered on ALIVEcode`);
    }

    // Register client
    const projectRights = iotObject.iotProjects.map(p => p.id);
    const client = new ObjectClient(socket, payload.id, projectRights);
    client.register();

    // Logging
    this.logger.log(`IoTObject connect with id : ${payload.id}`);

    client.sendEvent('connected', null);
  }

  @UseFilters(new IoTExceptionFilter())
  @SubscribeMessage('send_update')
  async send_update(@ConnectedSocket() socket: WebSocket, @MessageBody() payload: IoTUpdateRequestFromObject) {
    if (!payload.id || !payload.projectId || payload.value == null) throw new WsException('Bad payload');

    const object = ObjectClient.getClientBySocket(socket);
    if (!object) throw new WsException('Forbidden');

    if (!payload.projectId.includes('/')) {
      const project = await this.iotProjectService.findOne(payload.projectId);
      if (!project) throw new WsException('No project with id');

      if (project.interactRights !== IOTPROJECT_INTERACT_RIGHTS.ANYONE && !object.hasProjectRights(project.id))
        throw new WsException('Forbidden');

      await this.iotProjectService.updateComponent(project.id, payload.id, payload.value);
    } else {
      await this.iotProjectService.updateComponent(payload.projectId, payload.id, payload.value);
    }

    object.sendUpdate(payload);
  }

  @UseFilters(new IoTExceptionFilter())
  @SubscribeMessage('update')
  async update(@ConnectedSocket() socket: WebSocket, @MessageBody() payload: IoTUpdateDocumentRequestFromObject) {
    if (!payload.projectId || payload.fields == null || typeof payload.fields !== 'object')
      throw new WsException('Bad payload');
    await this.objectPermissionFilter(socket, payload.projectId);

    await this.iotProjectService.updateDocumentFields(payload.projectId, payload.fields);
  }

  @UseFilters(new IoTExceptionFilter())
  @SubscribeMessage('listen')
  async listen(@ConnectedSocket() socket: WebSocket, @MessageBody() payload: IoTListenRequestFromObject) {
    if (!payload.projectId && Array.isArray(payload.fields)) throw new WsException('Bad payload');
    const { object } = await this.objectPermissionFilter(socket, payload.projectId);

    const fields = payload.fields.filter(f => typeof f === 'string');
    object.listen(payload.projectId, fields);

    object.sendEvent('listener_set', null);
  }

  @UseFilters(new IoTExceptionFilter())
  @SubscribeMessage('send_object')
  send_object(@ConnectedSocket() socket: WebSocket, @MessageBody() payload: IoTActionRequestFromWatcher) {
    if (!payload.targetId || payload.actionId == null || payload.value == null) throw new WsException('Bad payload');

    const watcher = WatcherClient.getClientBySocket(socket);
    if (!watcher) throw new WsException('Forbidden');

    // TOOD : Add sending permission
    //if (!watcher.hasProjectRights(payload.projectId)) throw new WsException('Forbidden');

    watcher.sendActionToObject(payload);
  }

  @UseFilters(new IoTExceptionFilter())
  @SubscribeMessage('send_route')
  async send_route(@ConnectedSocket() socket: WebSocket, @MessageBody() payload: IoTRouteRequestFromObject) {
    if (!payload.routePath || !payload.data || !payload.projectId) throw new WsException('Bad payload');
    await this.objectPermissionFilter(socket, payload.projectId);

    const { route } = await this.iotProjectService.findOneWithRoute(payload.projectId, payload.routePath);
    await this.iotProjectService.sendRoute(route, payload.data);
  }

  @UseFilters(new IoTExceptionFilter())
  @SubscribeMessage('broadcast')
  async broadcast(@ConnectedSocket() socket: WebSocket, @MessageBody() payload: IoTBroadcastRequestFromBoth) {
    if (!payload.projectId || !payload.data) throw new WsException('Bad payload');
    const client = Client.getClientBySocket(socket);
    if (client instanceof ObjectClient) {
      await this.objectPermissionFilter(socket, payload.projectId);
    } else {
      throw new HttpException('Not Implemented', HttpStatus.NOT_IMPLEMENTED);
    }

    const data: IoTBroadcastRequestToObject = {
      event: 'broadcast',
      data: {
        projectId: payload.projectId,
        data: payload.data,
      },
    };

    const objects = ObjectClient.getClientsByProject(payload.projectId);
    objects.map(o => o.send(data));
  }

  /*****   HTTP PROTOCOLS   *****/

  @Post('getDoc')
  async getAll(@Body() payload: IoTGetDocRequestFromObject) {
    if (!payload.projectId || !payload.objectId) throw new HttpException('Bad payload', HttpStatus.BAD_REQUEST);
    const obj = ObjectClient.getClientById(payload.objectId);
    if (!obj) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    try {
      await this.objectPermissionFilter(obj.getSocket(), payload.projectId);
    } catch {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return await this.iotProjectService.getDocument(payload.projectId);
  }

  @Post('getField')
  async getField(@Body() payload: IoTGetFieldRequestFromObject) {
    if (!payload.projectId || !payload.objectId || !payload.field)
      throw new HttpException('Bad payload', HttpStatus.BAD_REQUEST);
    const obj = ObjectClient.getClientById(payload.objectId);
    if (!obj) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    try {
      await this.objectPermissionFilter(obj.getSocket(), payload.projectId);
    } catch {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return await this.iotProjectService.getField(payload.projectId, payload.field);
  }
}