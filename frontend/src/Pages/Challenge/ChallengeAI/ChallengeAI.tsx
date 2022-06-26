import { ChallengeAIProps, StyledAliveChallenge } from './challengeAITypes';
import { useEffect, useState, useContext, useRef, useMemo } from 'react';
import LineInterface from '../../../Components/ChallengeComponents/LineInterface/LineInterface';
import { UserContext } from '../../../state/contexts/UserContext';
import Cmd from '../../../Components/ChallengeComponents/Cmd/Cmd';
import ChallengeAIExecutor from './ChallengeAIExecutor';
import useCmd from '../../../state/hooks/useCmd';
import { ChallengeAI as ChallengeAIModel } from '../../../Models/Challenge/challenges/challenge_ai.entity';
import dataAI from './dataAI.json';
import PolyOptimizer from './artificial_intelligence/ai_optimizers/ai_reg_optimizers/PolyOptmizer';
import DataPoint from '../../../Components/ChallengeComponents/ChallengeGraph/DataTypes';
import { ChallengeContext } from '../../../state/contexts/ChallengeContext';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';
import ChallengeToolsBar from '../../../Components/ChallengeComponents/ChallengeToolsBar/ChallengeToolsBar';
import { NeuralNetwork } from './artificial_intelligence/ai_models/ai_neural_networks/NeuralNetwork';
import { GenHyperparameters } from './artificial_intelligence/AIUtilsInterfaces';
import { useAlert } from 'react-alert';
import {
	ACTIVATION_FUNCTIONS,
	COST_FUNCTIONS,
	MODEL_TYPES,
	NN_OPTIMIZER_TYPES,
} from '../../../Models/Ai/ai_model.entity';
import api from '../../../Models/api';
import { PolyRegression } from './artificial_intelligence/ai_models/ai_regression/PolyRegression';
import {
	GenAIModel,
	Hyperparameters,
} from './artificial_intelligence/AIUtilsInterfaces';
import { GenOptimizer } from './artificial_intelligence/AIUtilsInterfaces';
import { RegHyperparameters } from './artificial_intelligence/AIUtilsInterfaces';
import AIInterface from '../../../Components/ChallengeComponents/AIInterface/AIInterface';
import { AIDataset } from '../../../Models/Ai/ai_dataset.entity';
import {
	defaultHyperparams,
	defaultModelType,
} from './artificial_intelligence/ai_models/DefaultHyperparams';
import {
	Matrix,
	correlationCoeff,
	determinationCoeff,
} from './artificial_intelligence/AIUtils';
import { GradientDescent } from './artificial_intelligence/ai_optimizers/ai_nn_optimizers/GradientDescent';

/**
 * Ai challenge page. Contains all the components to display and make the ai challenge functionnal.
 *
 * @param {ChallengeAIModel} challenge ai challenge object
 * @param {boolean} editMode if the challenge is in editMode or not
 * @param {ChallengeProgression} progression the challenge progression of the current user
 * @param {string} initialCode the initial code of the challenge
 * @param {(challenge: ChallengeAIModel) => void} setChallenge callback used to modify the challenge in the parent state
 * @param {(progression: ChallengeProgression) => void} setProgression callback used to modify the challenge progression in the parent state
 *
 * @author Félix Jobin, Enric Soldevila, Mathis Laroche
 */
const ChallengeAI = ({ initialCode }: ChallengeAIProps) => {
	//Context objects related to challenges and users
	const { user } = useContext(UserContext);
	const {
		challenge: challengeUntyped,
		executor: executorUntyped,
		editMode,
		progression,
		setProgression,
		saveChallengeTimed,
		saveProgressionTimed,
		askForUserInput,
	} = useContext(ChallengeContext);
	const challenge = challengeUntyped as ChallengeAIModel;

	const executor =
		executorUntyped as React.MutableRefObject<ChallengeAIExecutor | null>; //Executor of the challenge

	const forceUpdate = useForceUpdate(); //To force the render on this component

	const [cmdRef, cmd] = useCmd(); //The console of this inteface
	const alert = useAlert();

	//Active model object for this challenge
	const model = useRef<GenAIModel>();

	//Active model type for this challenge
	const [modelType, setModelType] = useState<MODEL_TYPES>(defaultModelType);
	const regression = useRef<PolyRegression>();

	const [hyperparams, setHyperparams] =
		useState<GenHyperparameters>(defaultHyperparams); //Current hyperparameters of the challenge

	let optimizer = useRef<GenOptimizer>();

	//Active iocodes of this challenge use for all the calculations
	const activeIoCodes = useRef<number[]>([]);
	//Iocodes use to renitiate the activeIocodes
	const ioCodes = useRef<number[]>([]);
	//Active dataset of this challenge
	const activeDataset = useRef<AIDataset>();

	//Active model type of this challenge
	const [activeModel, setActiveModel] = useState<MODEL_TYPES | undefined>();

	// Initializing the LevelAIExecutor
	executor.current = useMemo(
		() =>
			(executor.current = new ChallengeAIExecutor(
				{
					createAndShowReg,
					initializeDataset,
					showDataCloud,
					resetGraph,
					optimizeRegression,
					evaluate: (x: number) => evaluate(x),
					costFunction,
					showRegression,
					columnValues,
					modelCreation,
					oneHot,
					normalizeColumn,
					normalize,
					predict,
					optimize,
					getIONames,
					deleteLine,
					coefficientCorrelation,
					coefficientDetermination,
					testNeuralNetwork,
				},
				challenge.name,
				askForUserInput,
				alert,
			)),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[challenge?.id, user, activeDataset, hyperparams, ioCodes, activeIoCodes],
	);

	//--------UseEffects-------//
	// Loading the dataset when first renders
	useEffect(() => {
		const getDataset = async () => {
			if (!challenge.dataset)
				challenge.dataset = await api.db.ai.getDataset(challenge.datasetId);
			if (challenge.dataset) {
				activeDataset.current = challenge.dataset.clone();
				activeIoCodes.current = challenge.dataset.getDataAsArray().map(() => -1);
				ioCodes.current = challenge.dataset.getDataAsArray().map(() => -1);
				console.log("TESTES",activeIoCodes.current)
				forceUpdate();
			} else {
				console.error("Erreur : la table ne s'est pas chargée correctement.");
			}
		};
		getDataset();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!cmd) return forceUpdate();
		if (executor.current) executor.current.cmd = cmd;
	}, [cmd, executor, forceUpdate]);

	//-----CALLBACK FUNCTIONS-------//

	/**
	 * Callback function called when an hyperparam is changed in the interface.
	 * @param newHyperparams the new Hyperparams object.
	 */
	const aiInterfaceHyperparamsChanges = (newHyperparams: Hyperparameters) => {
		let tempHyperparams: GenHyperparameters = JSON.parse(
			JSON.stringify(hyperparams),
		);
		(tempHyperparams[modelType] as Hyperparameters) = newHyperparams;
		setHyperparams(tempHyperparams);
		console.log('New Hyperparams ', hyperparams);
	};

	/**
	 * Callback function called when the model is changed in the interface.
	 * @param newModelType the new model type.
	 */
	const aiInterfaceModelChange = (newModelType: MODEL_TYPES) => {
		setModelType(newModelType);
	};

	/**
	 * Callback function called when the inputs or outputs are changed in the interface.
	 * @param newActiveIOCodes the new codes for inputs/outputs for the activeIOCodes.
	 * @param newIOCodes the new codes for inputs/outputs for the ioCodes.
	 */
	const aiInterfaceIOChange = (newActiveIOCodes: number[], newIOCodes: number[]) => {
		ioCodes.current = newIOCodes;
		activeIoCodes.current = newActiveIOCodes;
		let tempHyperparams: GenHyperparameters = JSON.parse(
			JSON.stringify(hyperparams),
		);
		tempHyperparams.NN.nbInputs = activeIoCodes.current.filter(e => e === 1).length;
		tempHyperparams.NN.nbOutputs = activeIoCodes.current.filter(e => e === 0).length;
		setHyperparams(tempHyperparams);
		console.log('New Hyperparams ', hyperparams);
		forceUpdate();
	};

	/**
	 * Callback function called when a change occurs in the LineInterface component.
	 * @param content the LineInterface's new content.
	 */
	const lineInterfaceContentChanges = (content: any) => {
		if (executor.current) executor.current.lineInterfaceContent = content;
		if (!editMode && progression) {
			progression.data.code = content;
			const updatedProgression = progression;
			setProgression(updatedProgression);
			saveProgressionTimed();
		}
	};

	//-------END OF CALLBACK FUNCTIONS-------//

	/**
	 * Initialies the dataset and the iocodes when the button run is clicked
	 */
	function initializeDataset() {
		//Initialize the ioCodes according to the table
		console.log('--- User click on run ---');

		//If the dataset is loaded
		if (activeDataset.current) {
			//Set IOCodes
			activeIoCodes.current =[]
			ioCodes.current.forEach(e=>activeIoCodes.current.push(e) )
			console.log('current iocodes : ', activeIoCodes.current);

			//Update inputs and outputs hyperparams
			hyperparams.NN.nbInputs = activeIoCodes.current!.filter(e => e === 1).length;
			hyperparams.NN.nbOutputs = activeIoCodes.current!.filter(e => e === 0).length;
			let indexArray: number[] = [];
			hyperparams.NN.neuronsByLayer = hyperparams.NN.neuronsByLayer.filter(
				(e, i) => {
					if (e === 0) indexArray.push(1);
					else return e;
				},
			);
			indexArray.forEach(i => {
				hyperparams.NN.activationsByLayer.splice(i, 1);
			});

			//Cloning the initial data
			activeDataset.current = challenge.dataset!.clone();
			optimizer.current = undefined;
			setActiveModel(undefined);
			forceUpdate();
		}
	}

	//-----------TODO change the followings when regressions are implemented---------//
	//Set the data for the challenge
	const [data] = useState(dataAI);

	//The dataset of the prototype AI course
	const mainDataset: DataPoint = {
		type: 'scatter',
		label: "Distance parcourue en fonction de l'énergie",
		data: data,
		backgroundColor: 'var(--contrast-color)',
		borderWidth: 1,
	};

	//The initial dataset of any course, which is no data
	const initialDataset: DataPoint = Object.freeze({
		type: 'scatter',
		label: "Distance parcourue en fonction de l'énergie",
		data: [{}],
		backgroundColor: 'var(--contrast-color)',
		borderWidth: 1,
	});
	let datasets = useRef([initialDataset, initialDataset]);
	const [chartData, setChartData] = useState({ datasets: [initialDataset] });

	/**
	 * Resets the dataset array and the data shown on the graph.
	 */
	function resetGraph() {
		datasets.current = [initialDataset, initialDataset];
		setChart();
	}

	/**
	 * Sets the chartData datasets with the datasets array.
	 */
	function setChart() {
		setChartData({ datasets: [...datasets.current] });
	}

	/**
	 * Adds a new datasets to the dataset array.
	 * @param newData the new dataset to add.
	 */
	function setDataOnGraph(newData: DataPoint): void {
		if (datasets.current[0] === initialDataset) {
			datasets.current = [newData];
		} else datasets.current[1] = newData;
		setChart();
	}

	//-------------------------- Alivescript functions ----------------------------//

	/**
	 * Sets the data of the graph to the challenge's data and displays it on the screen
	 */
	function showDataCloud(): void {
		setDataOnGraph(mainDataset);
	}

	/**
	 * Replaces the func with a new one with the specified parameters.
	 * @param a the param a of a polynomial regression.
	 * @param b the param b of a polynomial regression.
	 * @param c the param c of a polynomial regression.
	 * @param d the param d of a polynomial regression.
	 */
	function createRegression(a: number, b: number, c: number, d: number) {
		regression.current = new PolyRegression(
			'1',
			hyperparams[modelType] as RegHyperparameters,
		);
		optimizer.current = new PolyOptimizer(regression.current);
		model.current = regression.current;
	}

	/**
	 * Generates the latest regression's points and shows them on the graph.
	 */
	function showRegression() {
		const points = regression.current!.generatePoints();
		setDataOnGraph(points);
	}

	/**
	 * Creates the new Regression and displays it on the graph.
	 * @param a the param a of a polynomial regression.
	 * @param b the param b of a polynomial regression.
	 * @param c the param c of a polynomial regression.
	 * @param d the param d of a polynomial regression.
	 */
	function createAndShowReg(a: number, b: number, c: number, d: number): void {
		createRegression(a, b, c, d);
		showRegression();
	}

	/**
	 * Creates an optimizer if there isn't one
	 */
	function createOptimizer() {
		if (model.current && !optimizer.current) {
			switch (modelType) {
				case MODEL_TYPES.NEURAL_NETWORK:
					let modelTemp = model.current as NeuralNetwork;
					optimizer.current = new GradientDescent(modelTemp);
					break;
				case MODEL_TYPES.POLY_REGRESSION:
					regression.current = model.current as PolyRegression;
					optimizer.current = new PolyOptimizer(regression.current);
					break;
			}
			console.log('Current Optimizer : ', optimizer.current);
		}
	}

	/**
	 * Calculates the cost for the current model compared to the dataset of the challenge.
	 * @returns the calculated cost or error message 
	 */
	function costFunction() {
		if (!model.current) {
			return "Erreur : aucun modèle n'a été créé jusqu'à présent. Veuillez créer un modèle afin de calculer son erreur.";
		}

		if (activeDataset.current) {
			let input = activeDataset.current.getInputsOutputs(activeIoCodes.current)[0];
			let real = activeDataset.current.getInputsOutputs(activeIoCodes.current)[1];
			createOptimizer();

			try {
				if (optimizer.current)
					return optimizer.current.computeCost(input, real);
			} catch (e) {
				if (e instanceof Error) return e.message;
			}
		}
		return "Erreur : aucune donnée n'a été créé";
	}

	/**
	 * Creates a new Regression that fits as close as possible the data and shows it on
	 * the graph.
	 * @param lr the learning rate for the optimization algorithm.
	 */
	function optimizeRegression(lr: number, epochs: number): string | void {
		if (!model.current) {
			return "Erreur : aucun modèle n'a été créé jusqu'à présent.";
		}

		/*These lines are temporary, waiting for the frontend to be reworked

		optimizer.current?.setLearningRate(lr);
		optimizer.current?.setEpochs(epochs);
		model.current = optimizer.current?.optimize(
			inputs.current!,
			outputs.current!,
		);
		showRegression();
		*/
		return "Fin de l'optimisation";
	}

	//TODO rethink this function
	/**
	 * Evaluates the model with the value specified and returns the result.
	 * @param x the input of the model.
	 * @returns the output of the model.
	 */
	function evaluate(predInputs: number): number {
		setDataOnGraph(mainDataset);
		showRegression();
		const matInputs: Matrix = new Matrix([[predInputs]]);
		return model.current!.predict(matInputs.transpose()).getValue()[0][0];
	}

	/**
	 * Returns a table representing the data of the column asked.
	 * @param column The name of the column of the data base.
	 * @returns Table representing the data of the column asked.
	 */
	function columnValues(column: string): any[] {
		let index = activeDataset.current!.getParamNames().indexOf(column);
		let array: any[] = [];
		if (index !== -1) {
			for (
				let i = activeDataset.current!.getDataAsArray().at(0)!.length - 1;
				i >= 0;
				i--
			) {
				array.push(activeDataset.current!.getDataAsArray().at(index)?.at(i));
			}
		}
		return array;
	}

	/**
	 * Creates an ai model
	 */
	function modelCreation(): void {
		switch (modelType) {
			case MODEL_TYPES.NEURAL_NETWORK:
				model.current = new NeuralNetwork(
					'Neural Network Model',
					hyperparams[modelType],
					{
						layerParams: [],
					},
				);
				setActiveModel(MODEL_TYPES.NEURAL_NETWORK);
				console.log('Current Model', model.current);
				break;
			default:
				break;
		}
		forceUpdate();
	}

	/**
	 * Creats of a one shot associate to the column selected
	 * @param column the parameter's name to replace.
	 * @return error message
	 */
	function oneHot(
		name: string,
		colomn: string[],
		isother: boolean,
	): string | void {
		let index = activeDataset.current!.getParamNames().indexOf(name);
		const oldNumberParams = activeDataset.current!.getParamNames().length;
		const valueIO = activeIoCodes.current.at(index);

		if (
			activeDataset.current!.createOneHotWithNewParamsOneHot(
				name,
				colomn,
				isother,
			)
		) {
			const numberNewParams =
				activeDataset.current!.getParamNames().length - oldNumberParams;

			let newIOCodes = activeIoCodes.current;
			//Addind the new column to the IOcodes
			for (let e = 1; e <= numberNewParams; e++) {
				newIOCodes.splice(index + e, 0, valueIO!);
			}
			activeIoCodes.current = newIOCodes;
			hyperparams.NN.nbInputs = activeIoCodes.current.filter(e => e === 1).length;
			hyperparams.NN.nbOutputs = activeIoCodes.current.filter(e => e === 0).length;
			console.log("test2", activeDataset.current?.getParamNames)
			forceUpdate();
		} else {
			if (index !== -1)
				return 'Erreur : Les éléments de la colonne ne sont pas des chaines de caratères';
			else
				return 'Erreur : Le nom de la colonne entrée en paramètre est inexistante';
		}
	}

	/**
	 * Normalizes the data of the parameter and change the data of the table
	 * @param column the parameter's name to replace.
	 * @return error message
	 */
	function normalizeColumn(column: string): string | void {
		if (activeDataset.current) {
			let index = activeDataset.current.getParamNames().indexOf(column);
			if (index !== -1) {
				activeDataset.current.normalizeParam(column);
				forceUpdate();
			} else {
				if (index !== -1)
					return 'Erreur : Une colonne possède des chaines de caractères comme donnée dans la base de données';
				else
					return 'Erreur : Le nom de la colonne entrée en paramètre est inexistante';
			}
		} else return "Erreur : la base de données n'a pas été chargée.";
	}

	/**
	 * Normalizes the data of the parameter and change the data of the table
	 * @param column the parameter's name to replace.
	 * @param data the data to normalize
	 * @return error message or the value of the data normalize
	 */
	function normalize(column: string, data: number): string | number {
		if (activeDataset.current) {
			let index = activeDataset.current.getParamNames().indexOf(column);
			try {
				return activeDataset.current.normalizeValue(data, column);
			} catch (e) {
				if (index !== -1)
					return 'Erreur : Une colonne possède des chaines de caractères comme donnée dans la base de données';
				else
					return 'Erreur : Le nom de la colonne entrée en paramètre est inexistante';
			}
		} else return "Erreur : la base de données n'a pas été chargée.";
	}

	/**
	 * Predicts an array of outputs with the model
	 * @param input array of inputs
	 * @return the prediction
	 */
	function predict(input: number[]) {
		let tab: number[][] = [];

		//Column Matrix
		input.forEach(e => {
			let a = [];
			a.push(e);
			tab.push(a);
		});
		let matInput = new Matrix(tab);
		let respond;
		//Prediction
		try {
			respond = model.current?.predict(matInput).transpose();
		} catch (e) {
			if (e instanceof Error) {
				return e.message;
			}
		}
		return respond?.getValue();
	}

	/**
	 * Trains the model
	 * @return error message
	 */
	function optimize() {
		if (activeDataset.current) {
			let input = activeDataset.current.getInputsOutputs(activeIoCodes.current)[0];
			let real = activeDataset.current.getInputsOutputs(activeIoCodes.current)[1];
			createOptimizer();

			try {
				console.log('before :', model.current);
				model.current = optimizer.current?.optimize(input, real);
				console.log('after :', model.current);
			} catch (e) {
				if (e instanceof Error) return e.message;
			}
		}
	}

	/**
	 * Returns the names of the paraters that are an input or an output
	 * @returns error message or the input and output parameter names
	 */
	function getIONames() {
		if (activeDataset.current) {
			let params: string[] = activeDataset.current.getParamNames();
			let ioParams: string[] = [];
			for (let i = activeIoCodes.current.length - 1; i >= 0; i--) {
				if (activeIoCodes.current[i] !== -1) ioParams.push(params[i]);
			}
			//return ioParams;
			return activeDataset.current.getParamNames();
		}
		return "Erreur : la base de données n'a pas été chargée.";
	}

	/**
	 * Delete the line indicated in the dataset
	 * @param index the index of the line to delete
	 * @return Error message
	 */
	function deleteLine(index: number) {
		if (activeDataset.current) {
			activeDataset.current.deleteLine(index);
			forceUpdate();
		} else {
			return "Erreur : la base de données n'a pas été chargée.";
		}
	}

	/**
	 * Return the corralation coefficient
	 * @param lst1 First list of number to find the corralation coefficient
	 * @param list2 Second list of number to find the corralation coefficient
	 * @returns corralation coefficient
	 */
	function coefficientCorrelation(lst1: number[], list2: number[]) {
		let i = correlationCoeff(lst1, list2)
		return i;
	}

	/**
	 * Return the determination coefficient
	 * @param lst1 First list of number to find the determination coefficient
	 * @param list2 Second list of number to find the determination coefficient
	 * @returns determination coefficient
	 */
	function coefficientDetermination(lst1: number[], list2: number[]) {
		return determinationCoeff(lst1, list2);
	}

	// FOR TESTING PURPOSE ONLY, TO BE DELETED WHEN NEURAL NETWORK IMPLEMENTATION WORKS //

	function testNeuralNetwork(cmd: any) {
		/*
		mainAIUtilsTest();
		mainAINeuralNetworkTest();
		*/

		const neuralNet: NeuralNetwork = new NeuralNetwork(
			'1',
			{
				nbInputs: 2,
				nbOutputs: 2,
				neuronsByLayer: [2],
				activationsByLayer: [
					ACTIVATION_FUNCTIONS.RELU,
					ACTIVATION_FUNCTIONS.SIGMOID,
				],
				costFunction: COST_FUNCTIONS.MEAN_SQUARED_ERROR,
				learningRate: 0.1,
				epochs: 1000,
				type: NN_OPTIMIZER_TYPES.GradientDescent,
			},
			{
				layerParams: [
					{
						weights: [
							[1, 2],
							[3, 4],
						],
						biases: [1, 1],
					},
					{
						weights: [
							[4, 4],
							[4, 4],
						],
						biases: [1, 1],
					},
				],
			},
		);
		console.log(neuralNet);
		console.log(neuralNet.getModelParams());
	}

	// END OF TEST FUNCTION //

	return (
		<div className="relative h-full w-full">
			<div className="h-full flex flex-row">
				{/* Left Side of screen */}
				<div className="w-1/2 h-full flex flex-col">
					{/* Barre d'infos du niveau */}
					<ChallengeToolsBar />
					{/* Interface de code */}
					{editMode ? (
						/* Interface du code avec les tabs */
						<LineInterface
							key="edit-mode"
							hasTabs
							tabs={[
								{
									title: 'Initial Code',
									open: true,
									defaultContent: challenge.initialCode,
									onChange: content => {
										challenge.initialCode = content;
										saveChallengeTimed();
									},
								},
								{
									title: 'Solution',
									open: false,
									defaultContent: challenge.solution,
									onChange: content => {
										challenge.solution = content;
										saveChallengeTimed();
									},
								},
							]}
							handleChange={lineInterfaceContentChanges}
						/>
					) : (
						/* Interface de code sans les tabs */
						<LineInterface
							key="play-mode"
							initialContent={initialCode}
							handleChange={lineInterfaceContentChanges}
						/>
					)}
				</div>

				{/* Right Side of screen 
							Contains the graph and the console	
					*/}
				<div className="flex flex-col w-1/2">
					<AIInterface
						handleHyperparamChange={aiInterfaceHyperparamsChanges}
						handleModelChange={aiInterfaceModelChange}
						handleIOChange={aiInterfaceIOChange}
						tabs={[
							{
								title: 'Données',
								open: true,
							},
							{
								title: 'Modèle',
								open: false,
							},
							{
								title: 'Hyperparamètres',
								open: false,
							},
							{
								title: 'Optimiseur',
								open: false,
							},
						]}
						data={activeDataset.current}
						initData={challenge.dataset}
						modelType={modelType}
						hyperparams={hyperparams[modelType]}
						activeIoCodes={activeIoCodes.current}
						ioCodes={ioCodes.current}
						activeModel={activeModel}
					/>
					{/* TODO Code for visual regression ************
							<div className="w-1/3 h-full">
								<ChallengeTable
									data={data}
									xData="Énergie utilisée (kWh)"
									yData="Distance parcourue (km)"
								/>
							</div>
							<div className="w-2/3 h-full">
								<ChallengeGraph
									data={chartData}
									title="Distance parcourue selon l'énergie utilisée"
									xAxis="Énergie utilisée (kWh)"
									yAxis="Distance parcourue (km)"
								/>
							</div>
						*/}
					<div className="h-2/5 flex-1 command">
						<Cmd ref={cmdRef}></Cmd>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChallengeAI;
