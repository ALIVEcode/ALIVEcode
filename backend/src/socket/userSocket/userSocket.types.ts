import { WebSocket } from 'ws';
import { IoTProjectDocument, IoTProjectLayout, JsonObj } from '../../models/iot/IoTproject/entities/IoTproject.entity';

export type UserSocketTicketPayload = {
  id: string;
  email: string;
  ip: string;
};

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
  /** Object sends back a response meaning it finished doing the action */
  SEND_ACTION_DONE = 'action_done',
  /** The action done received from the object is sent back to the watchers to execute alivescript */
  RECEIVE_ACTION_DONE = 'receive_action_done',
  /** A route of the project is triggered */
  SEND_ROUTE = 'send_route',
  /** Update the interface of a project */
  UPDATE_INTERFACE = 'update_interface',
  /** Receives an updated interface request */
  RECEIVE_INTERFACE = 'receive_interface',

  /*---- Deprecated events ----*/
  UPDATE_COMPONENT = 'update_component',
  RECEIVE_UPDATE_COMPONENT = 'receive_update_component',

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
  id: string;
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

export type IoTActionDoneRequestFromObject = {
  actionId: string;
  value: any;
};

export type IoTActionDoneRequestToWatcher = {
  actionId: string;
  targetId: string;
  value: any;
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
  static clients: Client[] = [];

  constructor(private socket: WebSocket) {}

  static getClients() {
    return this.clients;
  }

  register() {
    this.isAlive = true;
    Client.clients.push(this);
  }

  getSocket() {
    return this.socket;
  }

  sendEvent(event: IOT_EVENT, data: any) {
    this.socket.send(JSON.stringify({ event, data }));
  }

  static removeClientBySocket(socket: WebSocket) {
    this.clients = this.getClients().filter(c => c.socket !== socket);
  }

  removeClient() {
    Client.removeClientBySocket(this.socket);
  }

  static getClientBySocket(socket: WebSocket) {
    return this.getClients().find(c => c.socket === socket);
  }
}