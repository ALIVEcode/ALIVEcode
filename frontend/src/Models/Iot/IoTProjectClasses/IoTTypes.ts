export type IoTObjectTarget = {
	id: string;
};

export type IoTClusterTarget = {
	id: string;
};

export type IoTTarget =
	| IoTObjectTarget
	| IoTClusterTarget
	| Array<IoTObjectTarget | IoTClusterTarget>;

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

export const dangerLogs = [IOT_EVENT.ERROR, IOT_EVENT.DISCONNECT_OBJECT];
export const warningLogs = [IOT_EVENT.DISCONNECT_PROJECT];
export const infoLogs = [
	IOT_EVENT.RECEIVE_ACTION,
	IOT_EVENT.RECEIVE_LISTEN,
	IOT_EVENT.RECEIVE_DOC,
	IOT_EVENT.RECEIVE_BROADCAST,
	IOT_EVENT.GET_FIELD,
];
export const successLogs = [
	IOT_EVENT.SUBSCRIBE_LISTENER_SUCCESS,
	IOT_EVENT.UNSUBSCRIBE_LISTENER_SUCCESS,
	IOT_EVENT.CONNECT_SUCCESS,
	IOT_EVENT.CONNECT_PROJECT,
];
