import { WsException } from '@nestjs/websockets';
import { WebSocket } from 'ws';
import { IoTProjectDocument, IoTProjectLayout, JsonObj } from '../../models/iot/IoTproject/entities/IoTproject.entity';

// REQUESTS FROM OBJECT

export type IoTUpdateDocumentRequestFromObject = {
  projectId: string;
  fields: JsonObj;
};

export type IoTGetDocRequestFromObject = {
  projectId: string;
  objectId: string;
};

export type IoTGetFieldRequestFromObject = {
  projectId: string;
  objectId: string;
  field: string;
};

export type IoTListenRequestFromObject = {
  projectId: string;
  fields: string[];
};

export type IoTUpdateRequestFromObject = {
  id: string;
  value: any;
  projectId: string;
};

export type IoTRouteRequestFromObject = {
  routePath: string;
  data: any;
  projectId: string;
};

export type IoTBroadcastRequestFromBoth = {
  projectId: string;
  data: any;
};

// REQUESTS TO OBJECTS

export type IoTSendActionRequestToObject = {
  event: 'action';
  data: {
    id: string;
    value: any;
  };
};

export type IoTListenRequestToObject = {
  event: 'listen';
  data: {
    projectId: string;
    fields: { [key: string]: any };
  };
};

export type IoTBroadcastRequestToObject = {
  event: 'broadcast';
  data: {
    projectId: string;
    data: any;
  };
};

// REQUESTS FROM WATCHER

export type IoTActionRequestFromWatcher = {
  targetId: string;
  actionId: string;
  value: any;
};

// REQUESTS TO THE WATCHER

export type IoTUpdateRequestToWatcher = {
  id: string;
  value: any;
};

export type IoTUpdateDocumentRequestToWatcher = {
  doc: IoTProjectDocument;
};

export type IoTUpdateLayoutRequestToWatcher = {
  layout: IoTProjectLayout;
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

  send(data: any) {
    this.socket.send(JSON.stringify(data));
  }

  sendEvent(event: string, data: any) {
    this.send({ event, data });
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

  sendActionToObject(updateData: IoTActionRequestFromWatcher) {
    const object = ObjectClient.getClientById(updateData.targetId);
    if (!object) throw new WsException('No matching object');

    const data: IoTSendActionRequestToObject = {
      event: 'action',
      data: {
        id: updateData.actionId,
        value: updateData.value,
      },
    };

    object.send(data);
  }
}

export class ObjectClient extends Client {
  static objects: ObjectClient[] = [];
  private id: string;
  private projectRights: string[];
  private listeners: { [key: string]: string[] } = {};

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

  listen(projectId: string, fields: string[]) {
    if (!(projectId in this.listeners)) this.listeners[projectId] = fields;
    else this.listeners[projectId] = [...this.listeners[projectId], ...fields];
  }

  static sendToListeners(projectId: string, fieldsUpdated: { [key: string]: any }) {
    ObjectClient.objects.forEach(o => {
      if (projectId in o.listeners) {
        const fieldsToSendNotification: { [key: string]: any } = {};
        Object.entries(fieldsUpdated).forEach(entry => {
          if (o.listeners[projectId].includes(entry[0])) fieldsToSendNotification[entry[0]] = entry[1];
        });

        const data: IoTListenRequestToObject = {
          event: 'listen',
          data: {
            projectId,
            fields: fieldsToSendNotification,
          },
        };
        o.send(data);
      }
    });
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

  static getClientsByProject(projectId: string) {
    return ObjectClient.objects.filter(o => o.projectRights.includes(projectId));
  }

  static isSocketAlreadyWatcher(socket: WebSocket) {
    return ObjectClient.objects.find(w => w.getSocket() === socket) != null;
  }

  sendUpdate(updateData: IoTUpdateRequestFromObject) {
    const watchers = WatcherClient.getClientsByProject(updateData.projectId);

    const data: IoTUpdateRequestToWatcher = {
      id: updateData.id,
      value: updateData.value,
    };

    watchers.forEach(w => w.sendEvent('update', data));
  }
}

export type WatcherClientConnectPayload = {
  iotProjectName: string;
  iotProjectId: string;
};

export type ObjectClientConnectPayload = {
  id: string;
};