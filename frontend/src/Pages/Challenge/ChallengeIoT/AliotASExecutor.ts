import { v4 as uuid } from 'uuid';
import ChallengeCodeExecutor from '../ChallengeCode/ChallengeCodeExecutor';
import { CompileDTO, SupportedLanguagesAS } from '../../../Models/ASModels';
import { typeAskForUserInput } from '../challengeTypes';
import { IoTSocket } from '../../../Models/Iot/IoTProjectClasses/IoTSocket';
import { IOT_EVENT } from '../../../Models/Iot/IoTProjectClasses/IoTTypes';

export default class AliotASExecutor extends ChallengeCodeExecutor {
	tokenId: string;
	url: string;
	ws: WebSocket;
	ASListeners: Array<{ fields: string[]; funcName: string }> = [];
	aliotSocket: IoTSocket;
	running: boolean = false;

	constructor(
		challengeName: string,
		askForUserInput: typeAskForUserInput,
		aliotSocket: IoTSocket,
		lang?: SupportedLanguagesAS,
	) {
		super(challengeName, askForUserInput, lang);
		const url = process.env['AS_WS_URL'];
		if (url === undefined) {
			throw new Error('MISSING AS_WS_URL IN .env');
		}
		this.aliotSocket = aliotSocket;
		this.registerActions([
			{
				actionId: 900,
				action: {
					label: 'Update doc',
					type: 'NORMAL',
					apply: params => {
						params.forEach(param => console.log(param));
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
		]);

		this.tokenId = uuid();
		this.url = url;
		this.doBeforeRun(() => {
			this.connect();
			this.running = true;
		});
		this.doAfterStop(() => {
			this.ws.close();
			this.running = false;
			console.log('Stopping aliotASExecutor');
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
			console.log('Connected ' + this.tokenId);
			const request = { type: 'COMPILE', lines: this.lineInterfaceContent };
			this.ws.send(JSON.stringify(request));
			console.log('Send compile request ' + request);
		};
		this.ws.onmessage = async event => {
			if (!event || !this.execution) {
				console.log('Ending execution');
				await this.interrupt();
				return;
			}
			console.log(event.data);
			this.execute(JSON.parse(event.data));
		};
		this.ws.onerror = event => {
			console.log(event);
		};
		this.ws.onclose = event => {
			console.log('Closing ' + this.tokenId);
			this.running = false;
		};
	}

	docFieldChanged(fieldChanged: { [key: string]: any }) {
		if (this.ws?.readyState !== WebSocket.OPEN) {
			console.log("Can't send doc field changed");
			return;
		}
		Object.entries(fieldChanged).forEach(([fieldName, newFieldValue]) => {
			console.log('Fields changed ' + fieldName + ': ' + newFieldValue);
			console.log(this.ASListeners);
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

	protected async sendDataToAsServer(data: CompileDTO): Promise<any> {}

	protected async executeNext(res: string[], firstTime: boolean = false) {
		if (firstTime) {
		}
	}
}
