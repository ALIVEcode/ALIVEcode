import { RegisterUserSocketEventPayload } from './userSocket.types';
import {
	UserSocketError,
	UserSocketMsgData,
	UserSocketEvents,
} from './userSocket.types';

const DEBUG_MODE = process.env.DEBUG && process.env.DEBUG === 'true';

export class UserSocketGeneric {
	private events: UserSocketEvents = {};
	private socket: WebSocket;

	private throwIfDebugMode(errorMsg: string) {
		if (DEBUG_MODE) throw new UserSocketError(errorMsg);
		return null;
	}

	private sendMessage(msg: UserSocketMsgData) {
		if (typeof msg !== 'object' || !('event' in msg) || !('data' in msg))
			return this.throwIfDebugMode(
				'Bad message sent to ws server: ' + String(msg),
			);
		this.socket.send(
			JSON.stringify({
				event: msg.event,
				data: msg.data,
			}),
		);
	}

	private parseMessage(e: string): UserSocketMsgData | null {
		try {
			const parsed = JSON.parse(e);
			if (!('event' in parsed) || !('data' in parsed))
				return this.throwIfDebugMode(
					'Bad message received from ws server: ' + String(e),
				);

			return {
				event: parsed['event'],
				data: parsed['data'],
			};
		} catch {
			return this.throwIfDebugMode(
				'Bad message received from ws server: ' + String(e),
			);
		}
	}

	open(ticket: string) {
		if (!process.env.USER_SOCKET_URL)
			throw new UserSocketError(
				'USER_SOCKET_GATEWAY_PORT was not set in .env. Copy the USER_SOCKET_GATEWAY_PORT variable from .env.example inside your .env file.',
			);
		this.socket = new WebSocket(
			process.env.USER_SOCKET_URL + '?ticket=' + ticket,
		);

		this.socket.onmessage = (e: MessageEvent<UserSocketMsgData>) => {
			// Parsing the message
			const msg = this.parseMessage(e.data as any as string);

			// If no message, returns
			if (!msg) return;

			// Fire the event
			this.fireEvent(msg.event, msg.data);
		};
	}

	async close() {
		this.socket.close();
	}

	isEventRegistered(eventName: string) {
		return eventName in this.events;
	}

	getEvent(eventName: string) {
		if (!this.isEventRegistered(eventName))
			return this.throwIfDebugMode(
				`UserSocket event of name "${eventName}" is not registered`,
			);

		return this.events[eventName];
	}

	registerEvent({ eventName, callback }: RegisterUserSocketEventPayload) {
		if (this.isEventRegistered(eventName))
			return this.throwIfDebugMode(
				`UserSocket event of name "${eventName}" is already registered`,
			);

		this.events[eventName] = { callback };
	}

	registerEvents(events: RegisterUserSocketEventPayload[]) {
		events.forEach(e => this.registerEvent(e));
	}

	fireEvent(eventName: string, eventData: any) {
		console.log(`FIRING ${eventName}`);
		const event = this.getEvent(eventName);
		if (!event) return;

		const res = event.callback(eventData);
		if (res) this.sendMessage(res);
	}
}
