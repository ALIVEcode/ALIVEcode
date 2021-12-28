import { WsException } from '@nestjs/websockets';
import { WebSocket } from 'ws';


export type MessageRequest = {
  message: string;
  message_user: string;
  time: any
  
};
export type UserConnect= {
  name: string;
}

export class Client {
  static clients: Client[] = [];

  constructor(private socket: WebSocket) {}

  register() {
    Client.clients.push(this);
  }

  getSocket() {
    return this.socket;
  }

  sendCustom(event: string, data: any) {
    this.socket.send(JSON.stringify({ event, data }));
  }

  removeSocket() {
    if (this instanceof WatcherClient) {
      WatcherClient.watchers = WatcherClient.watchers.filter(w => w.socket !== this.socket);
    }
    Client.clients = Client.clients.filter(w => w.socket !== this.socket);
  }

  static getClientBySocket(socket: WebSocket) {
    return Client.clients.find(c => c.socket === socket);
  }
}

export class WatcherClient extends Client {
  static watchers: WatcherClient[] = [];

  constructor(socket: WebSocket) {
    super(socket);
  }

  register() {
    super.register();
    WatcherClient.watchers.push(this);
  }

  static getClientBySocket(socket: WebSocket) {
    return WatcherClient.watchers.find(w => w.getSocket() === socket);
  }


  static isSocketAlreadyWatcher(socket: WebSocket) {
    return WatcherClient.watchers.find(w => w.getSocket() === socket) != null;
  }

}
export class ObjectClient extends Client {
  static objects: ObjectClient[] = [];
  private id: string;


  constructor(socket: WebSocket, id: string) {
    super(socket);
    this.id = id;

  }
}