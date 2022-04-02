import { LevelAIProps, StyledAliveLevel } from './levelAITypes';
import { useEffect, useState, useContext, useRef, useMemo } from 'react';
import LineInterface from '../../../Components/LevelComponents/LineInterface/LineInterface';
import { UserContext } from '../../../state/contexts/UserContext';
import Cmd from '../../../Components/LevelComponents/Cmd/Cmd';
import LevelAIExecutor from './LevelAIExecutor';
import useCmd from '../../../state/hooks/useCmd';
import { LevelAI as LevelAIModel } from '../../../Models/Level/levelAI.entity';
import dataAI from './dataAI.json';
import LevelTable from '../../../Components/LevelComponents/LevelTable/LevelTable';
import LevelGraph from '../../../Components/LevelComponents/LevelGraph/LevelGraph';
import PolyOptimizer from './artificial_intelligence/PolyOptmizer';
import RegressionOptimizer from './artificial_intelligence/RegressionOptimizer';
import DataTypes from '../../../Components/LevelComponents/LevelGraph/DataTypes';
import PolyRegression from './artificial_intelligence/PolyRegression';
import { LevelContext } from '../../../state/contexts/LevelContext';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';
import LevelToolsBar from '../../../Components/LevelComponents/LevelToolsBar/LevelToolsBar';
import { NeuralNetwork } from './artificial_intelligence/ai_models/ai_neural_networks/NeuralNetwork';
import { ActivationFunction, Relu, Sigmoid } from './artificial_intelligence/ai_functions/ActivationFunction';
import { Matrix } from './artificial_intelligence/AIUtils';
import { mainAIUtilsTest } from './artificial_intelligence/ai_tests/AIUtilsTest';
import { GradientDescent } from './artificial_intelligence/ai_optimizers/ai_ann_optimizers/GradientDescent';
import { CostFunction, MeanSquaredError } from './artificial_intelligence/ai_functions/CostFunction';
import { mainAINeuralNetworkTest } from './artificial_intelligence/ai_tests/AINeuralNetworkTest';

/**
 * Ai level page. Contains all the components to display and make the ai level functionnal.
 *
 * @param {LevelAIModel} level ai level object
 * @param {boolean} editMode if the level is in editMode or not
 * @param {LevelProgression} progression the level progression of the current user
 * @param {string} initialCode the initial code of the level
 * @param {(level: LevelAIModel) => void} setLevel callback used to modify the level in the parent state
 * @param {(progression: LevelProgression) => void} setProgression callback used to modify the level progression in the parent state
 *
 * @author Félix
 * @author Enric
 * @author Mathis
 */
const LevelAI = ({ initialCode }: LevelAIProps) => {
	const { user } = useContext(UserContext);
	const {
		level: levelUntyped,
		executor: executorUntyped,
		editMode,
		progression,
		setProgression,
		saveLevelTimed,
		saveProgressionTimed,
		askForUserInput,
	} = useContext(LevelContext);
	const level = levelUntyped as LevelAIModel;
	const executor =
		executorUntyped as React.MutableRefObject<LevelAIExecutor | null>;

	const forceUpdate = useForceUpdate();
	const [cmdRef, cmd] = useCmd();

	executor.current = useMemo(
		() =>
			(executor.current = new LevelAIExecutor(
				{
					createAndShowReg,
					showDataCloud,
					resetGraph,
					optimizeRegression,
					evaluate: (x: number) => evaluate(x),
					costMSE: () => costMSE(),
					showRegression,
					testNeuralNetwork
				},
				level.name,
				askForUserInput,
			)),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[level?.id, user],
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

	useEffect(() => {
		if (!cmd) return forceUpdate();
		if (executor.current) executor.current.cmd = cmd;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cmd]);

	//Set the data for the level
	const [data] = useState(dataAI);
	let allFuncs = useRef<PolyRegression[]>([]);
	let lastFunc = useRef<PolyRegression>();

	//The dataset of the prototype AI course
	const mainDataset: DataTypes = {
		type: 'scatter',
		label: "Distance parcourue en fonction de l'énergie",
		data: data,
		backgroundColor: 'var(--contrast-color)',
		borderWidth: 1,
	};

	//The initial dataset of any course, which is no data
	const initialDataset: DataTypes = Object.freeze({
		type: 'scatter',
		label: "Distance parcourue en fonction de l'énergie",
		data: [{}],
		backgroundColor: 'var(--contrast-color)',
		borderWidth: 1,
	});
	let datasets = useRef([initialDataset, initialDataset]);
	const [chartData, setChartData] = useState({ datasets: [initialDataset]});


	/**
	 * Resets the dataset array and the data shown on the graph.
	 */
	function resetGraph() {
		datasets.current = [initialDataset, initialDataset];
		allFuncs.current = [];
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
	function setDataOnGraph(newData: DataTypes): void {
		if (datasets.current[0] === initialDataset) {
			datasets.current = [newData];
		}
		else datasets.current[1] = newData;
		setChart();
	}
	//-------------------------- Alivescript functions ----------------------------//

	/**
	 * Sets the data of the graph to the level's data and displays it on the screen
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
		lastFunc.current = new PolyRegression(a, b, c, d);
		allFuncs.current.push(lastFunc.current);
	}

	/**
	 * Generates the latest regression's points and shows them on the graph.
	 */
	function showRegression() {
		const points = lastFunc.current!.generatePoints();
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
	 * Calculates the MSE cost for the current regression compared to the dataset of the level.
	 * @returns the calculated cost.
	 */
	function costMSE(): string {
		setDataOnGraph(mainDataset);
		showRegression();
		return 'Erreur du modèle : ' + lastFunc.current!.computeMSE(data);
	}

	/**
	 * Creates a new Regression that fits as close as possible the data and shows it on
	 * the graph.
	 * @param lr the learning rate for the optimization algorithm.
	 */
	function optimizeRegression(lr: number, epoch: number): string | void {
		if (!lastFunc.current) return;
		const optimizer: PolyOptimizer = new PolyOptimizer(
			lastFunc.current,
			lr,
			epoch,
			RegressionOptimizer.costMSE,
		);
		lastFunc.current = optimizer.optimize(data);
		showRegression();
		return lastFunc.current.paramsToString();
	}

	/**
	 * Evaluates the model with the value specified and returns the result.
	 * @param x the input of the model.
	 * @returns the output of the model.
	 */
	function evaluate(x: number): number {
		setDataOnGraph(mainDataset);
		showRegression();
		return lastFunc.current!.compute(x);
	}

	// FOR TESTING PURPOSE ONLY, TO BE DELETED WHEN NEURAL NETWORK IMPLEMENTATION WORKS //

	function testNeuralNetwork(cmd: any) {

		mainAIUtilsTest();
		mainAINeuralNetworkTest();
		
		/*
		const neuronsByLayer: number[] = [2, 2]
		const nbInputs: number = 3;
		const nbOutputs: number = 1;
		const activations: ActivationFunction[] = [
			new Relu(),
			new Relu()
		];
		const outputAct: ActivationFunction = new Relu();
		const costFunc: CostFunction = new MeanSquaredError();

		const data: Matrix = new Matrix([
			[10, 20, 3, 6, 4],
			[3, 5, 1, 2, 2],
			[2, 4, 1, 1, 1]
		]);

		const real: Matrix = new Matrix([
			[1500, 2000, 500, 800, 700]
		])

		cmd?.print("Les données entrées :");
		data.displayInCmd(cmd);
		cmd?.print("Colonne 1 : nombre de pièces");
		cmd?.print("Colonne 2 : nombre de chambres");
		cmd?.print("Colonne 3 : nombre de salles de bain");

		cmd?.print("Nombre de paramètres d'entrée : " + nbInputs);
		cmd?.print("Nombre de sorties : " + nbOutputs);

		let str: string = "Le nombre de neurones par couche : [" + neuronsByLayer[0];
		for (let i: number = 1; i < neuronsByLayer.length; i++) {
			str += ", " + neuronsByLayer[i]; 
		}
		cmd?.print(str + "]");

		let myNetwork: NeuralNetwork = new NeuralNetwork(nbInputs, nbOutputs, neuronsByLayer, activations, outputAct)
		let myOpt: GradientDescent = new GradientDescent(myNetwork, costFunc, 0.1, 1000);

		let predictions: Matrix = myNetwork.predict(data);
		predictions.displayInCmd(cmd);
		cmd?.print("");
		
		//let testCost: Matrix = activations[0].matDerivative(predictions);
		//testCost.displayInCmd(cmd);
		//let allPredictions: Matrix[] = myNetwork.predictReturnAll(data);
		//myOpt.optimizeOneEpoch(data, allPredictions, real);
		
		//predictions = myNetwork.predict(data);
		//predictions.displayInCmd(cmd);
		*/
	}


	// END OF TEST FUNCTION //



	return (
		<>
			<StyledAliveLevel>
				<div className="h-full flex flex-row">
					{/* Left Side of screen */}
					<div className="w-1/2 h-full flex flex-col">
						{/* Barre d'infos du niveau */}
						<LevelToolsBar />
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
										defaultContent: level.initialCode,
										onChange: content => {
											level.initialCode = content;
											saveLevelTimed();
										},
									},
									{
										title: 'Solution',
										open: false,
										defaultContent: level.solution,
										onChange: content => {
											level.solution = content;
											saveLevelTimed();
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
						<div className="h-3/5 w-full flex flex-row data-section">
							<div className="w-1/3 h-full">
								<LevelTable
									data={data}
									xData="Énergie utilisée (kWh)"
									yData="Distance parcourue (km)"
								/>
							</div>
							<div className="w-2/3 h-full">
								<LevelGraph
									data={chartData}
									title="Distance parcourue selon l'énergie utilisée"
									xAxis="Énergie utilisée (kWh)"
									yAxis="Distance parcourue (km)"
								/>
							</div>
						</div>
						<div className="h-2/5 flex-1 command">
							<Cmd ref={cmdRef}></Cmd>
						</div>
					</div>
				</div>
			</StyledAliveLevel>
		</>
	);
};

export default LevelAI;
