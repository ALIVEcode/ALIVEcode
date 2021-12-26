import { WsException } from '@nestjs/websockets';
import { WebSocket } from 'ws';

export type IoTSocketToObjectRequest = {
  targetId: string;
  actionId: number;
  value: any;
};

export type IoTSocketToObjectRequestObject = {
  id: number;
  value: any;
};

export type IoTSocketUpdateRequest = {
  id: string;
  value: any;
  projectId: string;
};

export type IoTSocketRouteRequest = {
  routePath: string;
  data: any;
  projectId: string;
};

export type IoTSocketUpdateRequestWatcher = {
  id: string;
  value: any;
};

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
    } else if (this instanceof ObjectClient) {
      ObjectClient.objects = ObjectClient.objects.filter(w => w.socket !== this.socket);
    }
    Client.clients = Client.clients.filter(w => w.socket !== this.socket);
  }

  static getClientBySocket(socket: WebSocket) {
    return Client.clients.find(c => c.socket === socket);
  }
}

export class WatcherClient extends Client {
  static watchers: WatcherClient[] = [];
  private projectId: string;

  constructor(socket: WebSocket, projectId: string) {
    super(socket);
    this.projectId = projectId;
  }

  register() {
    super.register();
    WatcherClient.watchers.push(this);
  }

  static getClientBySocket(socket: WebSocket) {
    return WatcherClient.watchers.find(w => w.getSocket() === socket);
  }

  static getClientsByProject(projectId: string) {
    return WatcherClient.watchers.filter(w => w.projectId === projectId);
  }

  static isSocketAlreadyWatcher(socket: WebSocket) {
    return WatcherClient.watchers.find(w => w.getSocket() === socket) != null;
  }

  sendToObject(updateData: IoTSocketToObjectRequest) {
    const object = ObjectClient.getClientById(updateData.targetId);
    if (!object) throw new WsException('No matching object');

    const data: IoTSocketToObjectRequestObject = {
      id: updateData.actionId,
      value: updateData.value,
    };

    object.getSocket().send(JSON.stringify(data));
  }
}

export class ObjectClient extends Client {
  static objects: ObjectClient[] = [];
  private id: string;
  private projectRights: string[];

  constructor(socket: WebSocket, id: string, projectRigths: string[]) {
    super(socket);
    this.id = id;
    this.projectRights = projectRigths;
  }

  register() {
    super.register();
    ObjectClient.objects.push(this);
  }

  hasProjectRights(projectId: string) {
    return this.projectRights.includes(projectId);
  }

  static getClientBySocket(socket: WebSocket) {
    return ObjectClient.objects.find(w => {
      return w.getSocket() === socket;
    });
  }

  static getClientById(id: string) {
    return ObjectClient.objects.find(o => {
      return o.id === id;
    });
  }

  static isSocketAlreadyWatcher(socket: WebSocket) {
    return ObjectClient.objects.find(w => w.getSocket() === socket) != null;
  }

  sendUpdate(updateData: IoTSocketUpdateRequest) {
    const watchers = WatcherClient.getClientsByProject(updateData.projectId);

    const data: IoTSocketUpdateRequestWatcher = {
      id: updateData.id,
      value: updateData.value,
    };

    watchers.forEach(w => w.sendCustom('update', data));
  }
}

export type WatcherClientConnectPayload = {
  iotProjectName: string;
  iotProjectId: string;
};

export type ObjectClientConnectPayload = {
  id: string;
};