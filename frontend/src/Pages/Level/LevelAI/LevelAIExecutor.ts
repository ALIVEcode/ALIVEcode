import LevelCodeExecutor from '../LevelCode/LevelCodeExecutor';
import { typeAskForUserInput } from '../levelTypes';

// TODO: robotConnected

class LevelAIExecutor extends LevelCodeExecutor {
	private executableFuncs: any;

	constructor(
		executables: { [key: string]: CallableFunction },
		levelName: string,
		askForUserInput: typeAskForUserInput,
	) {
		super(levelName, askForUserInput);

		this.doBeforeRun(() => {
			this.executableFuncs.resetGraph();
		});

		this.doAfterStop(() => {
			this.executableFuncs.resetGraph();
		});

		this.registerActions([
			{
				actionId: 800,
				action: {
					label: 'Create Regression',
					type: 'NORMAL',
					apply: params => {
						if (params.every((param: any) => typeof param === 'number')) {
							this.executableFuncs.createAndShowReg(
								params[0],
								params[1],
								params[2],
								params[3],
							);
						}
					},
				},
			},
			{
				actionId: 801,
				action: {
					label: 'Optimize Regression',
					type: 'NORMAL',
					apply: params => {
						if (params.every((param: any) => typeof param === 'number')) {
							const paramRegression = this.executableFuncs.optimizeRegression(
								params[0],
								params[1],
							);
							if (paramRegression !== undefined) {
								this.cmd?.print('Nouveaux paramètres de la régression :');
								this.cmd?.print(paramRegression);
							}
						}
					},
				},
			},
			{
				actionId: 802,
				action: {
					label: 'Show Data',
					type: 'NORMAL',
					apply: () => this.executableFuncs.showDataCloud(),
				},
			},
			{
				actionId: 803,
				action: {
					label: 'Evaluate',
					type: 'NORMAL',
					apply: (params, _, response) => {
						if (typeof params[0] === 'number')
							this.cmd?.print(this.executableFuncs.evaluate(params[0]));
					},
				},
			},
			{
				actionId: 804,
				action: {
					label: 'Cost Function',
					type: 'NORMAL',
					apply: () => {
						const out = this.executableFuncs.costMSE();
						this.cmd?.print(out);
					},
				},
			},
		]);

		this.executableFuncs = executables;
	}
}

export default LevelAIExecutor;