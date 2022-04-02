import { WsException } from '@nestjs/websockets';
import { WebSocket } from 'ws';
import { IoTProjectDocument, IoTProjectLayout, JsonObj } from '../../models/iot/IoTproject/entities/IoTproject.entity';

export enum IOT_EVENT {
  /*---------- Connection events ----------*/

  /** Connect as watcher (web view) */
  CONNECT_WATCHER = 'connect_watcher',
  /** Connect as IoTObject (arduino, raspberrpi, etc.) */
  CONNECT_OBJECT = 'connect_object',
  /** Connect IoTObject to a project */
  CONNECT_PROJECT = 'connect_project',
  /** Connect object as watcher */
  CONNECT_SUCCESS = 'connect_success',

  /*---------- Document Events ----------*/

  /** Update project document */
  UPDATE_DOC = 'update_doc',
  /** Subscribe a listener to a project */
  SUBSCRIBE_LISTEN = 'subscribe_listen',
  /** Unsubscribe a listener to a project */
  UNSUBSCRIBE_LISTEN = 'unsubscribe_listen',
  /** Callback when the subscription to a listener worked */
  SUBSCRIBE_LISTENER_SUCCESS = 'subscribe_listener_success',
  /** Callback when the unsubscription to a listener worked */
  UNSUBSCRIBE_LISTENER_SUCCESS = 'subscribe_listener_success',

  /*---------- Broadcast Events ----------*/

  /** Sendinga broadcast to the other objects connected to the same project */
  SEND_BROADCAST = 'send_broadcast',
  /** Receiving a broadcast from another object connected to the same project */
  RECEIVE_BROADCAST = 'receive_broadcast',

  /*---------- Error Events ----------*/

  /** When an error occurs */
  ERROR = 'error',

  /*---------- Misc Events ----------*/

  /** Sending an action to an object */
  SEND_ACTION = 'send_action',
  /** Object receives an action request */
  RECEIVE_ACTION = 'receive_action',
  /** A route of the project is triggered */
  SEND_ROUTE = 'send_route',

  /*---- Deprecated events ----*/
  SEND_UPDATE = 'send_update',

  /*---- Http requests ----*/

  /** Get the document of a project */
  GET_DOC = 'get_doc',
  /** Get the field of a document of a project */
  GET_FIELD = 'get_field',
}

// REQUESTS FROM OBJECT

export type IoTUpdateDocumentRequestFromObject = {
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
  fields: string[];
};

export type IoTUpdateRequestFromObject = {
  id: string;
  value: any;
};

export type IoTRouteRequestFromObject = {
  routePath: string;
  data: any;
};

export type IoTBroadcastRequestFromBoth = {
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
    fields: { [key: string]: any };
  };
};

export type IoTBroadcastRequestToObject = {
  event: 'broadcast';
  data: {
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

  setProjectId(projectId: string) {
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
  private _id: string;
  private _projectId: string;
  private listeners: string[];

  constructor(socket: WebSocket, id: string, projectId: string) {
    super(socket);
    this._id = id;
    this._projectId = projectId;
  }

  get id() {
    return this._id;
  }

  get projectId() {
    return this._projectId;
  }

  public setProjectId(projectId: string) {
    this._projectId = projectId;
  }

  register() {
    super.register();
    ObjectClient.objects.push(this);
  }

  listen(fields: string[]) {
    this.listeners.push(...fields);
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
      return o._id === id;
    });
  }

  static getClientsByProject(projectId: string) {
    return ObjectClient.objects.filter(o => o._projectId === projectId);
  }

  static isSocketAlreadyWatcher(socket: WebSocket) {
    return ObjectClient.objects.find(w => w.getSocket() === socket) != null;
  }
}

export type WatcherClientConnectPayload = {
  iotProjectName: string;
  iotProjectId: string;
};

export type ObjectClientConnectPayload = {
  id: string;
};