import { UserSocketGeneric } from './userSocketGeneric';

export class UserSocket extends UserSocketGeneric {
	constructor() {
		super();

		// Global Events
		this.registerEvents([
			{
				eventName: 'ping',
				callback: () => {
					return { event: 'pong', data: null };
				},
			},
			{
				eventName: 'receive-message',
				callback: ({ userId, msg }: { userId: string; msg: string }) => {
					console.log(`${userId} sent you the following message: ${msg}`);
				},
			},
		]);

		// IoT Events
		this.registerEvents([
			{
				eventName: 'object-connect',
				callback: (data: { objectId: string }) => {
					console.log(data);
				},
			},
		]);
	}
}
