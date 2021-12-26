import { Logger } from '@nestjs/common';
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
import {
  CarClient,
  WatcherConnectPayload,
  WatcherClient,
  ExecutionPayload,
  convertExecutionToBytes,
} from './car.types';
import { Server, WebSocket } from 'ws';

@WebSocketGateway(8888, { cors: { origin: '*' } })
export class CarGateway implements OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit {
  private cars: CarClient[] = [];
  private watchers: WatcherClient[] = [];
  private logger: Logger = new Logger('CarGateway');

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log(`Initialized`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleConnection(client: WebSocket) {
    //pass
  }

  handleDisconnect(client: WebSocket) {
    let watcher: WatcherClient;
    this.watchers.filter(c => {
      if (c.socket === client) {
        watcher = c;
        return false;
      }
      return true;
    });

    if (watcher) {
      this.logger.log(`Watcher disconnected`);
      return 'disconnected';
    }

    let car: CarClient;
    this.cars = this.cars.filter(c => {
      if (c.socket === client) {
        car = c;
        return false;
      }
      return true;
    });

    if (car) {
      this.logger.log(`Car disconnected`);
      return 'disconnected';
    }

    return 'disconnected';
  }

  @SubscribeMessage('connect_car')
  connectCar(@MessageBody() id: string, @ConnectedSocket() socket: WebSocket) {
    if (!id || typeof id !== 'string') throw new WsException('Bad payload');
    if (this.cars.find(c => c.socket === socket)) throw new WsException('Already registered as a car');
    this.cars = this.cars.filter(c => c.socket !== socket);
    //if (this.cars.find(c => c.id === id)) throw new WsException('Id already taken');

    this.cars.push({
      id,
      socket,
    });
    this.logger.log(`Car connected: ${id}`);
    return 'Car connected';
  }

  // TODO : payload validation
  @SubscribeMessage('connect_watcher')
  connect_watcher(@ConnectedSocket() socket: WebSocket, @MessageBody() payload?: WatcherConnectPayload) {
    if (!payload || !Array.isArray(payload.targets)) throw new WsException('Bad payload');
    if (this.watchers.find(w => w.socket === socket)) throw new WsException('Already registered as a watcher');

    this.watchers.push({
      socket,
      targets: payload.targets,
    });
    this.logger.log(`Watcher connected: ${socket}`);
    return {
      event: 'connect-success',
      data: 'Watcher connected',
    };
  }

  @SubscribeMessage('execute')
  send_execute(@ConnectedSocket() socket: WebSocket, @MessageBody() payload: ExecutionPayload) {
    if (!payload.executionResult || !Array.isArray(payload.executionResult)) throw new WsException('Bad payload');

    const watcher = this.watchers.find(w => w.socket === socket);
    if (!watcher) throw new WsException('Not authenticated');

    const { bufArray, bufView } = convertExecutionToBytes(payload.executionResult);

    this.cars.forEach(c => {
      if (watcher.targets.find(t => t.id === c.id)) {
        this.logger.log(`Sending ${bufView} to car id ${c.id}`);
        c.socket.send(bufArray);
      }
    });
  }
}