import { v4 as uuid } from 'uuid';
import ChallengeCodeExecutor from '../ChallengeCode/ChallengeCodeExecutor';
import { CompileDTO, SupportedLanguagesAS } from '../../../Models/ASModels';
import { typeAskForUserInput } from '../challengeTypes';

export default class AliotASExecutor extends ChallengeCodeExecutor {
	tokenId: string;
	url: string;
	ws: WebSocket;
	ASListeners: Array<{ field: string; funcName: string }> = [];
	running: boolean = false;

	constructor(
		challengeName: string,
		askForUserInput: typeAskForUserInput,
		lang?: SupportedLanguagesAS,
	) {
		super(challengeName, askForUserInput, lang);
		const url = process.env['AS_WS_URL'];
		if (url === undefined) {
			throw new Error('MISSING AS_WS_URL IN .env');
		}
		this.registerActions([
			{
				actionId: 901,
				action: {
					label: 'Subscribe listener',
					type: 'NORMAL',
					apply: params => {
						for (const field of params[0]) {
							// params[1] -> funcName
							if (
								!this.ASListeners.some(
									listener =>
										listener.field === field && listener.funcName === params[1],
								)
							) {
								this.ASListeners.push({ field, funcName: params[1] });
							}
						}
					},
				},
			},
		]);

		this.doAfterStop(() => {
			// this.ws.close();
		});

		this.tokenId = uuid();
		this.url = url;
	}

	connect() {
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			this.ws.close();
			this.tokenId = uuid();
		}
		this.ws = new WebSocket(`${this.url}/execute/${this.tokenId}`);

		this.ws.onopen = event => {
			this.ws.send(
				JSON.stringify({ type: 'COMPILE', lines: this.lineInterfaceContent }),
			);
		};
		this.ws.onmessage = async event => {
			if (!event || !this.execution) {
				await this.interrupt();
				this.ws.close();
				return;
			}
			this.execute(JSON.parse(event.data));
		};
		this.ws.onerror = event => {};
		this.ws.onclose = event => {};
	}

	docFieldChanged(fieldChange: string, newFieldValue: string) {
		if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
			return;
		}
		this.ASListeners.filter(listener => listener.field === fieldChange).forEach(
			listener => {
				this.ws.send(
					JSON.stringify({
						type: 'EXEC_FUNC',
						funcName: listener.funcName,
						args: [newFieldValue],
					}),
				);
			},
		);
	}

	protected async sendDataToAsServer(data: CompileDTO): Promise<any> {}

	protected async executeNext(res: string[], firstTime: boolean = false) {
		if (firstTime) {
			this.connect();
		} else {
			// TODO complété cette section qui est déclenchée en cas de commande comme `lire`
		}
	}
}
