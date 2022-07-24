import ChallengeCodeExecutor from '../ChallengeCode/ChallengeCodeExecutor';
import { typeAskForUserInput } from '../challengeTypes';
import { AlertManager } from 'react-alert';
import { Console } from 'console';
import { SupportedLanguagesAS } from '../../../Models/ASModels';

// TODO: robotConnected

class ChallengeAIExecutor extends ChallengeCodeExecutor {
	private executableFuncs: any;

	constructor(
		executables: { [key: string]: CallableFunction },
		challengeName: string,
		askForUserInput: typeAskForUserInput,
		alert?: AlertManager,
		lang?: SupportedLanguagesAS,
	) {
		super(challengeName, askForUserInput, alert, lang);

		this.doBeforeRun(() => {
			//this.executableFuncs.resetGraph();
			this.executableFuncs.initializeDataset();
		});

		this.doBeforeInterrupt(() => {
			this.executableFuncs.initializeDataset();
		});

		this.doAfterStop(() => {
			//this.executableFuncs.resetGraph();
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
					type: 'GET',
					apply: (params, _, response) => {
						if (typeof params[0] === 'number') {
							response?.push(this.executableFuncs.evaluate(params[0]));
							console.log(
								'Response sent : ' + this.executableFuncs.evaluate(params[0]),
							);
							//this.cmd?.print("Modèle évalué avec " + params[0] + " => " + this.executableFuncs.evaluate(params[0]));

							this.perform_next();
						}
					},
				},
			},

			{
				actionId: 804,
				action: {
					label: 'Cost Function',
					type: 'GET',
					apply: (params, _, response) => {
						const out = this.executableFuncs.costFunction();
						response?.push(out);
						this.perform_next();
					},
				},
			},
			{
				actionId: 805,
				action: {
					label: 'Test ANN',
					type: 'NORMAL',
					apply: () => {
						this.executableFuncs.testNeuralNetwork(this.cmd);
					},
				},
			},
			{
				actionId: 806,
				action: {
					label: 'Valeurs Colonne',
					type: 'GET',
					apply: (params, _, response) => {
						if (typeof params[0] === 'string') {
							response?.push('Creation of a list');
							let objectList: any[] = this.executableFuncs.columnValues(
								params[0],
							);
							objectList.forEach(e => response?.push(e));

							this.perform_next();
						}
					},
				},
			},
			{
				actionId: 807,
				action: {
					label: 'Création Modèle',
					type: 'NORMAL',
					apply: () => {
						this.executableFuncs.modelCreation();
					},
				},
			},
			{
				actionId: 808,
				action: {
					label: 'One Hot',
					type: 'NORMAL',
					apply: params => {
						if (
							typeof params[0] === 'string' &&
							typeof params[1] === 'object' &&
							typeof params[2] === 'boolean'
						) {
							const out: string | undefined = this.executableFuncs.oneHot(
								params[0],
								params[1],
								params[2],
							);
							if (out !== undefined) {
								this.cmd?.print(out);
							}
						}
					},
				},
			},
			{
				actionId: 809,
				action: {
					label: 'Normaliser Colonne',
					type: 'GET',
					apply: (params, _, response) => {
						if (typeof params[0] === 'string') {
							let out = this.executableFuncs.normalizeColumn(params[0]);
							if (out) {
								console.log(out);
								response?.push(out);
							} else response?.push(null);
							this.perform_next();
						}
					},
				},
			},
			{
				actionId: 810,
				action: {
					label: 'Normaliser',
					type: 'GET',
					apply: (params, _, response) => {
						if (
							typeof params[0] === 'string' &&
							typeof params[1] === 'number'
						) {
							const out = this.executableFuncs.normalize(params[0], params[1]);
							if (typeof out === 'string' || out) {
								response?.push(out);
							} else {
								response?.push(null);
							}
							this.perform_next();
						}
					},
				},
			},
			{
				actionId: 811,
				action: {
					label: 'Predire',
					type: 'GET',
					apply: (params, _, response) => {
						if (typeof params[0] === 'object') {
							let objectList = this.executableFuncs.predict(params[0]);
							if (typeof objectList !== 'string') {
								response?.push('Creation of a list');
								let objectList: number[][] = this.executableFuncs.predict(
									params[0],
								);
								objectList[0].forEach(e => {
									response?.push(e);
								});
							} else {
								response?.push(objectList);
							}
							this.perform_next();
						}
					},
				},
			},
			{
				actionId: 812,
				action: {
					label: 'Optimiser',
					type: 'NORMAL',
					apply: () => {
						let out = this.executableFuncs.optimize();

						if (typeof out === 'string') {
							this.cmd?.print(out);
						}
					},
				},
			},
			{
				actionId: 813,
				action: {
					label: 'IO Names',
					type: 'GET',
					apply: (params, _, response) => {
						let out: string[] = this.executableFuncs.getIONames();
						console.log(out);
						response?.push('Creation of a list');
						out.forEach(e => response?.push(e));
						this.perform_next();
					},
				},
			},
			{
				actionId: 814,
				action: {
					label: 'Delete Line',
					type: 'NORMAL',
					apply: params => {
						if (typeof params[0] === 'number') {
							let out = this.executableFuncs.deleteLine(params[0]);
							if (typeof out === 'string') {
								this.cmd?.print(out);
							}
						}
					},
				},
			},
			{
				actionId: 815,
				action: {
					label: 'Coefficient Correlation',
					type: 'GET',
					apply: (params, _, response) => {
						if (
							typeof params[0] === 'object' &&
							typeof params[1] === 'object'
						) {
							let out = this.executableFuncs.coefficientCorrelation(
								params[0],
								params[1],
							);
							response?.push(out);
							this.perform_next();
						}
					},
				},
			},
			{
				actionId: 816,
				action: {
					label: 'Coefficient Dermination',
					type: 'GET',
					apply: (params, _, response) => {
						if (
							typeof params[0] === 'object' &&
							typeof params[1] === 'object'
						) {
							let out = this.executableFuncs.coefficientDetermination(
								params[0],
								params[1],
							);
							response?.push(out);
							this.perform_next();
						}
					},
				},
			},
		]);

		this.executableFuncs = executables;
	}
}

export default ChallengeAIExecutor;
