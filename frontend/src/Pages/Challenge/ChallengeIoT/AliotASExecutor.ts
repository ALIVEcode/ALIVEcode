import { v4 as uuid } from 'uuid';
import { CompileDTO, SupportedLanguagesAS } from '../../../Models/ASModels';
import { IoTSocket } from '../../../Models/Iot/IoTProjectClasses/IoTSocket';
import { IOT_EVENT } from '../../../Models/Iot/IoTProjectClasses/IoTTypes';
import { AlertManager } from 'react-alert';
import { ChallengeExecutor } from '../AbstractChallengeExecutor';
import api from '../../../Models/api';

export default class AliotASExecutor extends ChallengeExecutor {
	tokenId: string;
	url: string;
	ws: WebSocket;
	ASListeners: Array<{ fields: string[]; funcName: string }> = [];
	aliotSocket: IoTSocket;
	running: boolean = false;
	error?: string;

	constructor(
		challengeName: string,
		aliotSocket: IoTSocket,
		public readonly objectId: string,
		public readonly userId: string,
		lang?: SupportedLanguagesAS,
		private alert?: AlertManager,
	) {
		super(challengeName, lang);
		const url = process.env['AS_WS_URL'];
		if (url === undefined) {
			throw new Error('MISSING AS_WS_URL IN .env');
		}
		this.aliotSocket = aliotSocket;
		this.registerActions([
			{
				actionId: 301,
				action: {
					label: 'Wait',
					type: 'NORMAL',
					apply: params => {
						if (params.length > 0 && typeof params[0] === 'number') {
							this.wait(() => {
								this.perform_next();
							}, params[0] * 1000);
						} else {
							this.perform_next();
						}
					},
					handleNext: true,
				},
			},
			{
				actionId: 302,
				action: {
					label: 'Notif Info',
					type: 'NORMAL',
					apply: params => {
						alert?.info(params[0]);
					},
				},
			},
			{
				actionId: 303,
				action: {
					label: 'Notif Error',
					type: 'NORMAL',
					apply: params => {
						alert?.error(params[0]);
					},
				},
			},
			{
				actionId: 400,
				action: {
					label: 'Error',
					type: 'NORMAL',
					apply: async params => {
						if (
							params.length >= 3 &&
							typeof params[0] === 'string' &&
							typeof params[1] === 'string' &&
							typeof params[2] === 'number'
						) {
							this.error = `${params[0]}: ${params[1]} (at line ${params[2]})`;
							alert?.error(this.error);
							await this.interrupt();
						}
					},
				},
			},
			{
				actionId: 900,
				action: {
					label: 'Update doc',
					type: 'NORMAL',
					apply: params => {
						this.aliotSocket.sendEvent(IOT_EVENT.UPDATE_DOC, {
							fields: params[0],
						});
					},
				},
			},
			{
				actionId: 901,
				action: {
					label: 'Subscribe listener',
					type: 'NORMAL',
					apply: params => {
						const [fields, funcName]: [string[], string] = params as [
							string[],
							string,
						];
						this.ASListeners.push({ fields, funcName });
						this.aliotSocket.registerListener(fields);
					},
				},
			},
			{
				actionId: 902,
				action: {
					label: 'Unsubscribe listener',
					type: 'NORMAL',
					apply: params => {
						const [funcName] = params;
						this.ASListeners = this.ASListeners.filter(
							listener => listener.funcName !== funcName,
						);
					},
				},
			},
			{
				actionId: 903,
				action: {
					label: 'Send Action',
					type: 'NORMAL',
					apply: params => {
						// implicit target
						if (params.length === 2) {
							if (!this.objectId) return;
							this.aliotSocket.sendAction(this.objectId, params[0], params[1]);
						}
						// explicit target
						else {
							this.aliotSocket.sendAction(params[2], params[0], params[1]);
						}
					},
				},
			},
			{
				actionId: 907,
				action: {
					label: 'Get doc',
					type: 'NORMAL',
					apply: async params => {
						console.log(params);
						const response = await api.db.iot.projects.aliot.getDoc(
							this.userId,
						);
						this.ws.send(
							JSON.stringify({
								type: 'RESUME',
								responseData: [response],
							}),
						);
						this.perform_next();
					},
					handleNext: true,
				},
			},
			{
				actionId: 908,
				action: {
					label: 'Get field',
					type: 'NORMAL',
					apply: async params => {
						console.log(params);
						const response = await api.db.iot.projects.aliot.getField(
							this.userId,
							params[0],
						);
						this.ws.send(
							JSON.stringify({
								type: 'RESUME',
								responseData: [response],
							}),
						);
						this.perform_next();
					},
					handleNext: true,
				},
			},
		]);

		this.tokenId = uuid();
		this.url = url;
		this.doBeforeRun(() => {
			this.connect();
			this.error = undefined;
			this.running = true;
		});
		this.doAfterStop(() => {
			this.ws.close();
			this.error = undefined;
			this.running = false;
			// console.log('Stopping aliotASExecutor');
		});
	}

	connect() {
		this.aliotSocket.openSocket();

		if (
			this.ws &&
			(this.ws.readyState === WebSocket.OPEN ||
				this.ws.readyState === WebSocket.CONNECTING)
		) {
			this.ws.close();
		}

		this.ws = new WebSocket(`${this.url}/execute/${this.tokenId}`);

		this.ws.onopen = event => {
			// console.log('Connected ' + this.tokenId);
			const request = { type: 'COMPILE', lines: this.lineInterfaceContent };
			this.ws.send(JSON.stringify(request));
			// console.log('Send compile request ' + request);
		};
		this.ws.onmessage = async event => {
			if (!event || !this.execution) {
				// console.log('Ending execution');
				await this.interrupt();
				return;
			}
			// console.log(event.data);
			this.execute(JSON.parse(event.data));
		};
		this.ws.onerror = event => {
			// console.log(event);
		};
		this.ws.onclose = event => {
			// console.log('Closing ' + this.tokenId);
			this.running = false;
		};
	}

	docFieldChanged(fieldChanged: { [key: string]: any }) {
		if (this.ws?.readyState !== WebSocket.OPEN) {
			// console.log("Can't send doc field changed");
			return;
		}
		Object.entries(fieldChanged).forEach(([fieldName, newFieldValue]) => {
			// console.log('Fields changed ' + fieldName + ': ' + newFieldValue);
			// console.log(this.ASListeners);
			this.ASListeners.filter(listener =>
				listener.fields.includes(fieldName),
			).forEach(listener => {
				this.ws.send(
					JSON.stringify({
						type: 'EXEC_FUNC',
						funcName: listener.funcName,
						args: [fieldName, newFieldValue],
					}),
				);
			});
		});
	}

	override async interrupt() {
		this._beforeInterrupt && this._beforeInterrupt();
		this.stop();
	}

	override async sendDataToAsServer(data: CompileDTO): Promise<any> {}

	override async executeNext(res: string[], firstTime: boolean = false) {}
}
