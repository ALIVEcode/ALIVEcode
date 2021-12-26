import axios from 'axios';
import { CMD } from '../../Components/LevelComponents/Cmd/cmdTypes';
import { User } from '../../Models/User/user.entity';

export abstract class LevelExecutor {
	public cmd?: CMD;
	public lineInterfaceContent: string = '';
	private timeouts: Array<NodeJS.Timeout> = [];
	public execution: boolean = false;
	public onToggleExecution?: (exec: any) => void;
	protected whenExecutionEnd: (result: any[]) => void;
	private idToken: string;

	constructor(public levelName: string, public creator?: User) {}

	protected async sendDataToAsServer(
		data:
			| { lines: string }
			| { idToken: string; responseData: string[] }
			| { idToken: string; status: 'interrupted' },
	) {
		try {
			return (
				await axios({
					method: 'POST',
					url: '/compile/',
					baseURL: process.env.REACT_APP_AS_URL,
					data,
				})
			).data;
		} catch {
			this.cmd?.error(
				"Une erreur inconnue est survenue. Vérifiez pour des erreurs dans votre code, sinon, les services d'alivescript sont hors-ligne.",
				-1,
			);
		}
	}

	public toggleExecution() {
		this.onToggleExecution && this.onToggleExecution(this);
		this.execution ? this.run() : this.interrupt();
	}

	public run() {
		!this.execution && this.onToggleExecution && this.onToggleExecution(this);
		this.cmd?.clear();
		this.onRun();
	}

	public stop() {
		this.execution && this.onToggleExecution && this.onToggleExecution(this);
		// Clear all the timouts of the execution
		for (let timeout of this.timeouts) {
			clearTimeout(timeout);
		}
		this.onStop();
	}

	public async interrupt() {
		if (this.idToken) {
			await this.sendDataToAsServer({
				idToken: this.idToken,
				status: 'interrupted',
			});
		}
		this.stop();
	}

	public async onRun() {
		// Envoie le code à exécuter au serveur
		const lines: string = this.lineInterfaceContent;

		try {
			let data = await this.sendDataToAsServer({ lines });

			if (!this.execution) this.interrupt();

			this.whenExecutionEnd = async res => {
				data = await this.sendDataToAsServer({
					idToken: this.idToken,
					responseData: res,
				});
				if (!data || !this.execution) {
					this.interrupt();
					return;
				}
				if (process.env.REACT_APP_DEBUG) console.log(data);
				if (data.status === 'complete') {
					this.execute(data.result);
					return;
				}
				this.idToken = data.idToken;
				if (process.env.REACT_APP_DEBUG) console.log(this.idToken, data.data);
				this.execute(data.result);
			};

			if (process.env.REACT_APP_DEBUG) console.log(data);
			if (data.status === 'complete') {
				this.execute(data.result);
				return;
			}

			this.idToken = data.idToken;

			if (process.env.REACT_APP_DEBUG) console.log(this.idToken, data.result);

			this.execute(data.result);
		} catch (err) {
			this.interrupt();
		}
	}

	public abstract init(args: any): any;
	public abstract onStop(): any;
	public abstract execute(data: any): any[];
}