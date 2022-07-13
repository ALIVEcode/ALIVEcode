export class UserSocketError extends Error {}

export type UserSocketMsgData = {
	event: string;
	data: any;
};

export type EventCallback = (data: any) => UserSocketMsgData | void;

export type RegisterUserSocketEventPayload = {
	eventName: string;
	callback: EventCallback;
};

export type UserSocketEvent = {
	callback: EventCallback;
};

export type UserSocketEvents = { [key: string]: UserSocketEvent };
