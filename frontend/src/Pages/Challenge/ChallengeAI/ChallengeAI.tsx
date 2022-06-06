import { ChallengeAIProps, StyledAliveChallenge } from './challengeAITypes';
import { useEffect, useState, useContext, useRef, useMemo } from 'react';
import LineInterface from '../../../Components/ChallengeComponents/LineInterface/LineInterface';
import { UserContext } from '../../../state/contexts/UserContext';
import Cmd from '../../../Components/ChallengeComponents/Cmd/Cmd';
import ChallengeAIExecutor from './ChallengeAIExecutor';
import useCmd from '../../../state/hooks/useCmd';
import { ChallengeAI as ChallengeAIModel } from '../../../Models/Challenge/challenges/challenge_ai.entity';
import dataAI from './dataAI.json';
import ChallengeTable from '../../../Components/ChallengeComponents/ChallengeTable/ChallengeTable';
import ChallengeGraph from '../../../Components/ChallengeComponents/ChallengeGraph/ChallengeGraph';
import PolyOptimizer from './artificial_intelligence/ai_optimizers/ai_reg_optimizers/PolyOptmizer';
import DataPoint from '../../../Components/ChallengeComponents/ChallengeGraph/DataTypes';
import { ChallengeContext } from '../../../state/contexts/ChallengeContext';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';
import ChallengeToolsBar from '../../../Components/ChallengeComponents/ChallengeToolsBar/ChallengeToolsBar';
import { NeuralNetwork } from './artificial_intelligence/ai_models/ai_neural_networks/NeuralNetwork';
import { matAdd, Matrix } from './artificial_intelligence/AIUtils';
import {
	GenHyperparameters,
	NNHyperparameters,
	NNModelParams,
} from './artificial_intelligence/AIUtilsInterfaces';
import { useAlert } from 'react-alert';
import { GradientDescent } from './artificial_intelligence/ai_optimizers/ai_nn_optimizers/GradientDescent';
import {
	NN_OPTIMIZER_TYPES,
	COST_FUNCTIONS,
	MODEL_TYPES,
} from '../../../Models/Ai/ai_model.entity';
import api from '../../../Models/api';
import { ACTIVATION_FUNCTIONS } from '../../../Models/Ai/ai_model.entity';
import { PolyRegression } from './artificial_intelligence/ai_models/ai_regression/PolyRegression';
import {
	RegHyperparameters,
	GenAIModel,
} from './artificial_intelligence/AIUtilsInterfaces';
import {
	RegModelParams,
	GenOptimizer,
} from './artificial_intelligence/AIUtilsInterfaces';
import { GenRegression } from './artificial_intelligence/AIUtilsInterfaces';
import AIInterface from '../../../Components/ChallengeComponents/AIInterface/AIInterface';
import { AIDataset } from '../../../Models/Ai/ai_dataset.entity';
import { mainAIUtilsTest } from './artificial_intelligence/ai_tests/AIUtilsTest';

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
		executorUntyped as React.MutableRefObject<ChallengeAIExecutor | null>;

	const forceUpdate = useForceUpdate();
	const [cmdRef, cmd] = useCmd();
	const alert = useAlert();

	//Model variables to keep track on the current Model, its type and hyperparameters.
	let model = useRef<GenAIModel>();
	let activeModelType = useRef<string>();
	let regression = useRef<PolyRegression>();

	//TODO replace these codes with the ones chosen in the interface
	const ioCodes = useRef<number[]>([]);
	let inputs = useRef<Matrix>();
	let outputs = useRef<Matrix>();
	let means = useRef<number[]>();
	let outputMean = useRef<number>();
	let outputDeviation = useRef<number>();
	let deviations = useRef<number[]>();

	// Loading the dataset when first renders
	useEffect(() => {
		const getDataset = async () => {
			if (!challenge.dataset)
				challenge.dataset = await api.db.ai.getDataset(challenge.datasetId);
			forceUpdate();
			if (challenge.dataset)
				ioCodes.current = challenge.dataset.getDataAsArray().map(() => -1);
			else
				console.error("Erreur : la table ne s'est pas chargée correctement.");
		};
		getDataset();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Initializing the LevelAIExecutor
	executor.current = useMemo(
		() =>
			(executor.current = new ChallengeAIExecutor(
				{
					createAndShowReg,
					showDataCloud,
					resetGraph,
					optimizeRegression,
					evaluate: (x: number) => evaluate(x),
					costFunction,
					showRegression,
					columnValues,
					modelCreation,
					testNeuralNetwork,
					setDataset: setDatasetStats,
				},
				challenge.name,
				askForUserInput,
				alert,
			)),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[challenge?.id, user],
	);

	const lineInterfaceContentChanges = (content: any) => {
		if (executor.current) executor.current.lineInterfaceContent = content;
		if (!editMode && progression) {
			progression.data.code = content;
			const updatedProgression = progression;
			setProgression(updatedProgression);
			saveProgressionTimed();
		}
	};

	//-----CALLBACK FUNCTIONS-------//

	/**
	 * Callback function called when an hyperparam is changed in the interface.
	 * @param newHyperparams the new Hyperparams object.
	 */
	const aiInterfaceHyperparamsChanges = (newHyperparams: any) => {
		console.log('New Hyperparams');
		console.log(newHyperparams);
	};

	/**
	 * Callback function called when the model is changed in the interface.
	 * @param newModelType the new model type.
	 */
	const aiInterfaceModelChange = (newModelType: string) => {
		activeModelType.current = newModelType;
	};

	/**
	 * Callback function called when the inputs or outputs are changed in the interface.
	 * @param newIOCodes the new codes for inputs/outputs.
	 */
	const aiInterfaceIOChange = (newIOCodes: number[]) => {
		ioCodes.current = newIOCodes;
		forceUpdate();
	};

	useEffect(() => {
		if (!cmd) return forceUpdate();
		if (executor.current) executor.current.cmd = cmd;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cmd]);

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

	//TODO link this declaration to the interface when completed
	//Change the type to GenHyperparameters
	const hyperparams: RegHyperparameters = {
		regressionType: MODEL_TYPES.POLY_REGRESSION,
		costFunction: COST_FUNCTIONS.MEAN_SQUARED_ERROR,
		learningRate: 0.0001,
		epochs: 1000,
	};

	let optimizer = useRef<GenOptimizer>();

	/**
	 * Sets the statistics related to the current dataset from this challenge.
	 * This function is called every time the run button is hit and when the dataset is
	 * loaded for the first time.
	 */
	function setDatasetStats() {
		[inputs.current, outputs.current] = challenge.dataset!.getInputsOutputs(
			ioCodes.current,
		);
		if (inputs.current) {
			console.log('Existing inputs');
			means.current = inputs.current.meanOfAllRows();
			deviations.current = inputs.current.deviationOfAllRows();
		}
		if (outputs.current) {
			console.log('Existing outputs');
			outputMean.current = outputs.current.meanOfAllRows()[0];
			outputDeviation.current = outputs.current.deviationOfAllRows()[0];
		}
	}

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
		const modelParams: RegModelParams = {
			params: [a, b, c, d],
		};
		regression.current = new PolyRegression('1', hyperparams, modelParams);
		regression.current.setNormalization(
			means.current!,
			deviations.current!,
			outputMean.current,
			outputDeviation.current,
		);
		optimizer.current = new PolyOptimizer(regression.current, hyperparams);
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
	 * Calculates the cost for the current model compared to the dataset of the challenge.
	 * @returns the calculated cost.
	 */
	function costFunction(): string {
		if (!model.current) {
			return "Erreur : aucun modèle n'a été créé jusqu'à présent. Veuillez créer un modèle afin de calculer son erreur.";
		}
		return (
			'Erreur du modèle : ' +
			optimizer.current!.computeCost(inputs.current!, outputs.current!)
		);
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

		//These lines are temporary, waiting for the frontend to be reworked
		optimizer.current?.setLearningRate(lr);
		optimizer.current?.setEpochs(epochs);
		model.current = optimizer.current?.optimize(
			inputs.current!,
			outputs.current!,
		);
		showRegression();
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
		let index = challenge.dataset!.getParamNames().indexOf(column);
		let array: any[] = []
		if(index != -1){
			for (let i = challenge.dataset!.getDataAsArray().at(0)!.length-1; i>=0; i--){
				array.push(challenge.dataset!.getDataAsArray().at(index)?.at(i))
			}
		}
		return array
	}

	function modelCreation() {
		
	}

	// FOR TESTING PURPOSE ONLY, TO BE DELETED WHEN NEURAL NETWORK IMPLEMENTATION WORKS //

	function testNeuralNetwork(cmd: any) {
		/*
		mainAIUtilsTest();
		mainAINeuralNetworkTest();
		*/
		let dataset = challenge.dataset;
		if (!dataset) {
			return cmd.error(
				'Challenge is still loading. Please try again after the challenge is properly loaded',
				0,
			);
		}
		/*
		let hyperparams: NNHyperparameters = {
			
			
			model: {
				nb_inputs: 3,
				nb_outputs: 1,
				neurons_by_layer: [10, 10, 10],
				activations_by_layer: [
					ACTIVATION_FUNCTIONS.RELU,
					ACTIVATION_FUNCTIONS.RELU,
					ACTIVATION_FUNCTIONS.RELU,
				],
			},
			optimizer: {
				cost_function: COST_FUNCTIONS.MEAN_SQUARED_ERROR,
				learning_rate: 0.0001,
				epochs: 1000,
				type: NN_OPTIMIZER_TYPES.GradientDescent,
			},
		};

		let modelParams: NNModelParams = {
			layerParams: [],
		};

		const inputsOutputs: Matrix[] = dataset.getInputsOutputs([1, 1, 1, 0]);
		const inputs: Matrix = inputsOutputs[0];
		const outputs: Matrix = inputsOutputs[1];
		const paramNames: string[] = dataset.getParamNames();

		const nbInputs: number = hyperparams.model.nb_inputs;
		const nbOutputs: number = hyperparams.model.nb_outputs;
		const neuronsByLayer: number[] = hyperparams.model.neurons_by_layer;

		for (let i: number = 0; i < paramNames.length; i++) {
			cmd?.print('Colonne ' + i + ' : ' + paramNames[i]);
		}

		cmd?.print('Les entrées : ');
		inputs.displayInCmd(cmd);

		cmd?.print('Les sorties : ');
		outputs.displayInCmd(cmd);

		cmd?.print("Nombre de paramètres d'entrée : " + nbInputs);
		cmd?.print('Nombre de sorties : ' + nbOutputs);

		let str: string =
			'Le nombre de neurones par couche : [' + neuronsByLayer[0];
		for (let i: number = 1; i < neuronsByLayer.length; i++) {
			str += ', ' + neuronsByLayer[i];
		}
		cmd?.print(str + ']');

		let myNetwork: NeuralNetwork = new NeuralNetwork('1', hyperparams);
		let myOpt: GradientDescent = new GradientDescent(myNetwork, hyperparams);
		console.log(myOpt);

		let predictions: Matrix = myNetwork.predict(inputs);
		predictions.displayInCmd(cmd);
		console.log(
			"Erreur avant l'entraînement : " +
				myOpt.getCostFunction().matCompute(predictions, outputs),
		);
		cmd?.print('');

		myNetwork = myOpt.optimize(inputs, outputs);

		predictions = myNetwork.predict(inputs);
		predictions.displayInCmd(cmd);

		console.log(
			"Erreur après l'entraînement: " +
				myOpt.getCostFunction().matCompute(predictions, outputs),
		);
		console.log(predictions.getRows() + ' par ' + predictions.getColumns());
		console.log(outputs.getRows() + ' par ' + outputs.getColumns());
		*/
	}

	// END OF TEST FUNCTION //

	console.log('ChallengeAI updated');
	return (
		<>
			<StyledAliveChallenge>
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
							data={challenge.dataset}
							hyperparams={hyperparams}
							ioCodes={ioCodes.current}
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
			</StyledAliveChallenge>
		</>
	);
};

export default ChallengeAI;
