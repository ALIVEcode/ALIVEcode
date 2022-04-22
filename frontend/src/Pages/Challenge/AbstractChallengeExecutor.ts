import { CMD } from '../../Components/ChallengeComponents/Cmd/cmdTypes';
import { typeAction } from './challengeTypes';
import {
	CompileDTO,
	CompileStatus,
	SupportedLanguagesAS,
} from '../../Models/ASModels';
import api from '../../Models/api';

/**
 * Abstract class were the execution of alivescript is handled
 *
 *
 * @author Mathis Laroche
 */
export class ChallengeExecutor {
	public cmd?: CMD;
	public lineInterfaceContent: string = '';
	private timeouts: Array<NodeJS.Timeout> = [];
	public execution: boolean = false;
	public onToggleExecution?: (exec: any) => void;
	private idToken: string;
	private backendContext: CompileDTO;

	private registeredActions: { [actionId: number]: typeAction } = {
		0: {
			label: 'Stop Execution',
			type: 'NORMAL',
			apply: () => {
				if (this.cmd) {
					this.cmd.print('[exécution terminée]');
				}
			},
		},
		400: {
			label: 'Error',
			type: 'NORMAL',
			apply: params => {
				if (
					params.length >= 3 &&
					typeof params[0] === 'string' &&
					typeof params[1] === 'string' &&
					typeof params[2] === 'number'
				)
					if (this.cmd) {
						this.cmd.error(`${params[0]}: ${params[1]}`, params[2]);
					}
			},
		},
	};

	public current_execution: {
		next: () => void;
		getIndex: () => number;
	} | null;

	/** function called before the exection of the code */
	private _beforeRun: () => void;

	/** function called before the interruption of the execution of the code */
	protected _beforeInterrupt: () => void;
	/** function called before the end of the exection of the code */
	private _beforeStop: () => void;
	/** function called after the end or the interruption of the exection of the code */
	private _afterStop: () => void;

	constructor(
		public challengeName: string,
		private _lang: SupportedLanguagesAS = 'fr',
	) {}

	protected async sendDataToAsServer(data: CompileDTO) {
		try {
			return await api.as.compile(
				{
					...data,
					...this.backendContext,
				},
				this.lang,
			);
		} catch {
			this.cmd?.error(
				"Une erreur inconnue est survenue. Vérifiez pour des erreurs dans votre code, sinon, les services d'alivescript sont hors-ligne.",
				-1,
			);
		}
	}

	protected registerActions(
		actions: { actionId: number; action: typeAction }[],
	) {
		actions.forEach(
			action => (this.registeredActions[action.actionId] = action.action),
		);
	}

	public toggleExecution() {
		this.onToggleExecution && this.onToggleExecution(this);
		this.execution = !this.execution;
		this.execution ? this.run() : this.interrupt();
	}

	public async run() {
		!this.execution && this.onToggleExecution && this.onToggleExecution(this);
		this.cmd?.clear();
		await this.onRun();
	}

	public stop() {
		this._beforeStop && this._beforeStop();
		this.execution && this.onToggleExecution && this.onToggleExecution(this);
		// Clear all the timeouts of the execution
		for (let timeout of this.timeouts) {
			clearTimeout(timeout);
		}
		this.current_execution = null;
		this._afterStop && this._afterStop();
	}

	public async interrupt() {
		try {
			this._beforeInterrupt && this._beforeInterrupt();
		} finally {
			if (this.idToken) {
				await this.sendDataToAsServer({
					idToken: this.idToken,
					status: CompileStatus.INTERRUPT,
				});
			}
			this.stop();
		}
	}

	protected async executeNext(res: string[], firstTime = false) {
		const data = await this.sendDataToAsServer(
			firstTime
				? {
						lines: this.lineInterfaceContent,
				  }
				: {
						idToken: this.idToken,
						responseData: res,
				  },
		);

		if (!data || !this.execution) {
			await this.interrupt();
			return;
		}
		if (process.env.DEBUG) console.log(data);
		if (data.status === 'failed') {
			return this.cmd?.error('Internal Error', 0);
		}
		if (data.status === 'ongoing') {
			this.idToken = data.idToken;
		}
		this.execute(data.result);
	}

	public async onRun() {
		this._beforeRun && this._beforeRun();
		try {
			// Envoie le code à exécuter au serveur
			await this.executeNext([], true);
		} catch (err) {
			await this.interrupt();
		}
	}

	private perform_actions(
		actions: { id: number; params: any[]; dodo: number }[],
	) {
		const response: any[] = [];

		const perform_action = async (index: number) => {
			const action = actions[index];
			const performedAction = this.registeredActions[action.id];
			if (!(action.id in this.registeredActions)) {
				console.error(
					`The action id: ${action.id} is not in the registered actions`,
				);
				return this.perform_next();
			}
			performedAction.apply(action.params, action.dodo, response);

			if (!performedAction.handleNext && performedAction.type !== 'GET')
				this.perform_next();
		};

		let i = -1;
		return {
			next: async () => {
				if (i >= 0) {
					const action = actions[i];
					if (action.id in this.registeredActions) {
						const performedAction = this.registeredActions[action.id];
						if (performedAction.type === 'GET') {
							const data = await this.sendDataToAsServer({
								idToken: this.idToken,
								responseData: response,
							});
							return this.execute(data.result);
						}
					}
				}
				i++;
				if (i >= actions.length) return;
				await perform_action(i);
			},
			getIndex: () => i,
		};
	}

	public perform_next() {
		this.current_execution && this.current_execution.next();
	}

	protected execute(actions: any[]): void {
		const ID = 'id';
		const DODO = 'd';
		const PARAMS = 'p';

		const hasValidDataStructure = (action: any): boolean => {
			return (
				ID in action &&
				typeof action[ID] === 'number' &&
				DODO in action &&
				typeof action[DODO] === 'number' &&
				PARAMS in action &&
				Array.isArray(action[PARAMS])
			);
		};

		const formatedActions = actions.map(action => {
			if (!hasValidDataStructure(action)) {
				(async () => await this.interrupt())();
				throw new Error();
			}
			return {
				id: action[ID] as number,
				params: action[PARAMS] as any[],
				dodo: action[DODO] as number,
			};
		});

		this.current_execution = this.perform_actions(formatedActions);
		this.current_execution.next();
	}

	public setBackendContext(compileDTO: CompileDTO) {
		this.backendContext = compileDTO;
	}

	set lang(lang: SupportedLanguagesAS) {
		this._lang = lang;
	}

	get lang() {
		return this._lang;
	}

	public wait(callback: () => void, duration: number) {
		this.timeouts.push(setTimeout(callback, duration));
	}

	public doBeforeRun(callback: () => void): void {
		this._beforeRun = callback;
	}

	public doBeforeInterrupt(callback: () => void): void {
		this._beforeInterrupt = callback;
	}

	public doBeforeStop(callback: () => void): void {
		this._beforeStop = callback;
	}

	public doAfterStop(callback: () => void): any {
		this._afterStop = callback;
	}
}
