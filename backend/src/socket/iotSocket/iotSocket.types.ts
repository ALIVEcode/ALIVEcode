import { WebSocket } from 'ws';
import { IoTObjectService } from '../../models/iot/IoTobject/IoTobject.service';
import { IoTProjectDocument, IoTProjectLayout, JsonObj } from '../../models/iot/IoTproject/entities/IoTproject.entity';

export enum IOT_EVENT {
  /*---------- Connection events ----------*/

  /** Connect as watcher (web view) */
  CONNECT_WATCHER = 'connect_watcher',
  /** Connect as IoTObject (arduino, raspberrpi, etc.) */
  CONNECT_OBJECT = 'connect_object',
  /** Connect as IoTObject (arduino, raspberrpi, etc.) */
  DISCONNECT_OBJECT = 'disconnect_object',
  /** Connect IoTObject to a project */
  CONNECT_PROJECT = 'connect_project',
  /** Connect IoTObject to a project */
  DISCONNECT_PROJECT = 'disconnect_project',
  /** Connect object as watcher */
  CONNECT_SUCCESS = 'connect_success',
  /** PING */
  PING = 'ping',
  /** PONG */
  PONG = 'pong',

  /*---------- Document Events ----------*/

  /** Update project document */
  UPDATE_DOC = 'update_doc',
  /** Receive updated doc */
  RECEIVE_DOC = 'receive_doc',
  /** Subscribe a listener to a project */
  SUBSCRIBE_LISTENER = 'subscribe_listener',
  /** Unsubscribe a listener to a project */
  UNSUBSCRIBE_LISTENER = 'unsubscribe_listener',
  /** Callback when the subscription to a listener worked */
  SUBSCRIBE_LISTENER_SUCCESS = 'subscribe_listener_success',
  /** Callback when the unsubscription to a listener worked */
  UNSUBSCRIBE_LISTENER_SUCCESS = 'subscribe_listener_success',
  /** Receives a listen callback */
  RECEIVE_LISTEN = 'receive_listen',

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
  /** Update the interface of an interface */
  UPDATE_INTERFACE = 'update_interface',
  /** Receiveds an updated interface request */
  RECEIVE_INTERFACE = 'receive_interface',

  /*---- Deprecated events ----*/
  UPDATE_COMPONENT = 'update_component',
  RECEIVE_UPDATE_COMPONENT = 'receive_update_component',

  /*---- Http requests ----*/

  /** Get the document of a project */
  GET_DOC = 'getDoc',
  /** Get the field of a document of a project */
  GET_FIELD = 'getField',
}

// REQUESTS FROM OBJECT

export type IoTUpdateDocumentRequestFromObject = {
  fields: JsonObj;
};

export type IoTGetDocRequestFromObject = {
  objectId: string;
};

export type IoTGetFieldRequestFromObject = {
  id: string;
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
  event: IOT_EVENT.RECEIVE_ACTION;
  data: {
    id: string;
    value: any;
  };
};

export type IoTListenRequestToObject = {
  event: IOT_EVENT.RECEIVE_LISTEN;
  data: {
    fields: { [key: string]: any };
  };
};

export type IoTBroadcastRequestToObject = {
  event: IOT_EVENT.RECEIVE_BROADCAST;
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
  public isAlive: boolean;
  private listeners: string[] = [];

  constructor(private socket: WebSocket, private _id: string, private _projectId: string | null) {}

  get id() {
    return this._id;
  }

  get projectId() {
    return this._projectId;
  }

  setProjectId(projectId: string) {
    this._projectId = projectId;
  }

  static getClients() {
    const clients: Array<ObjectClient | WatcherClient> = [];
    return clients.concat(ObjectClient.objects).concat(WatcherClient.watchers);
  }

  register() {
    this.isAlive = true;
  }

  getSocket() {
    return this.socket;
  }

  sendEvent(event: IOT_EVENT, data: any) {
    this.socket.send(JSON.stringify({ event, data }));
  }

  static removeClientBySocket(socket: WebSocket) {
    WatcherClient.watchers = WatcherClient.watchers.filter(w => w.socket !== socket);
    ObjectClient.objects = ObjectClient.objects.filter(w => w.socket !== socket);
  }

  removeClient() {
    if (this instanceof WatcherClient)
      WatcherClient.watchers = WatcherClient.watchers.filter(w => w.socket !== this.socket);
    else if (this instanceof ObjectClient)
      ObjectClient.objects = ObjectClient.objects.filter(w => w.socket !== this.socket);
  }

  subscribeListener(fields: string[]) {
    this.listeners.push(...fields);
  }

  static getClientById(id: string) {
    return Client.getClients().find(o => {
      return o.id === id;
    });
  }

  static async sendToListeners(
    projectId: string,
    fieldsUpdated: { [key: string]: any },
    iotObjectService: IoTObjectService,
  ) {
    Client.getClients().forEach(async client => {
      if (client.projectId === projectId) {
        const fieldsToSendNotification: { [key: string]: any } = {};
        let nbFields = 0;
        Object.entries(fieldsUpdated).forEach(entry => {
          if (client.listeners.includes(entry[0])) {
            fieldsToSendNotification[entry[0]] = entry[1];
            nbFields++;
          }
        });

        if (nbFields > 0) {
          if (client instanceof ObjectClient) {
            const object = await iotObjectService.findOne(client.id);
            iotObjectService.addIoTObjectLog(
              object,
              IOT_EVENT.RECEIVE_LISTEN,
              `Received listen callback because those fields were modified: "${JSON.stringify(fieldsUpdated)}"`,
            );
          }

          const req: IoTListenRequestToObject = {
            event: IOT_EVENT.RECEIVE_LISTEN,
            data: {
              fields: fieldsToSendNotification,
            },
          };
          client.sendEvent(req.event, req.data);
        }
      }
    });
  }

  static getClientBySocket(socket: WebSocket) {
    return this.getClients().find(c => c.socket === socket);
  }
}

export class WatcherClient extends Client {
  static watchers: WatcherClient[] = [];
  private _isCreator: boolean;

  constructor(socket: WebSocket, id: string, projectId: string | null, isCreator = false) {
    super(socket, id, projectId);
    this._isCreator = isCreator;
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

  static getClientById(id: string) {
    return WatcherClient.getClients().find(o => {
      return o.id === id;
    });
  }
}

export class ObjectClient extends Client {
  static objects: ObjectClient[] = [];

  constructor(socket: WebSocket, id: string, projectId: string | null) {
    super(socket, id, projectId);
  }

  register() {
    super.register();
    ObjectClient.objects.push(this);
  }

  static getClientBySocket(socket: WebSocket) {
    return ObjectClient.objects.find(w => {
      return w.getSocket() === socket;
    });
  }

  static getClientsByProject(projectId: string) {
    return ObjectClient.objects.filter(o => o.projectId === projectId);
  }

  static isSocketAlreadyWatcher(socket: WebSocket) {
    return ObjectClient.objects.find(w => w.getSocket() === socket) != null;
  }

  static getClientById(id: string) {
    return ObjectClient.getClients().find(o => {
      return o.id === id;
    });
  }
}

export type WatcherClientConnectPayload = {
  userId: string;
  iotProjectName: string;
  iotProjectId: string;
};

export type ObjectClientConnectPayload = {
  id: string;
};