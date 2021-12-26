import { LevelAIProps, StyledAliveLevel } from './levelAITypes';
import { useEffect, useState, useContext, useRef, useMemo } from 'react';
import LineInterface from '../../../Components/LevelComponents/LineInterface/LineInterface';
import { UserContext } from '../../../state/contexts/UserContext';
import { Row, Col } from 'react-bootstrap';
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
import PolyRegression from '../../../Components/LevelComponents/LevelGraph/PolyRegression';
import { LevelContext } from '../../../state/contexts/LevelContext';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';
import LevelToolsBar from '../../../Components/LevelComponents/LevelToolsBar/LevelToolsBar';

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
	let func = useRef<PolyRegression>();
	const mainDataset: DataTypes = {
		type: 'scatter',
		label: "Distance parcourue en fonction de l'énergie",
		data,
		backgroundColor: 'var(--contrast-color)',
		borderWidth: 1,
	};
	const initialDataset: DataTypes = Object.freeze({
		type: 'scatter',
		label: "Distance parcourue en fonction de l'énergie",
		data: [{}],
		backgroundColor: 'var(--contrast-color)',
		borderWidth: 1,
	});
	let datasets = useRef([initialDataset]);
	let pointsOnGraph: boolean = false;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let regOnGraph: boolean = false;

	const [chartData, setChartData] = useState({ datasets: datasets.current });

	/**
	 * Resets the datasets array and the data shown on the graph.
	 */
	function resetGraph() {
		datasets.current = [initialDataset];
		setChartData({ datasets: datasets.current });
	}

	/**
	 * Adds a new dataset to the datasets array.
	 * @param newData the new dataset to add.
	 */
	function setDataOnGraph(newData: DataTypes): void {
		datasets.current.push(newData);
		setChartData({ datasets: datasets.current });
	}
	//-------------------------- Alivescript functions ----------------------------//

	/**
	 * Sets the data of the graph to the level's data and displays it on the screen
	 */
	function showDataCloud(): void {
		pointsOnGraph = true;
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
		func.current = new PolyRegression(a, b, c, d);
	}

	/**
	 * Generates the regression's points and shows them on the graph.
	 */
	function showRegression() {
		const points = func.current!.generatePoints();
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
		if (pointsOnGraph) setDataOnGraph(mainDataset);
		showRegression();
		return 'Erreur du modèle : ' + func.current!.computeMSE(data);
	}

	/**
	 * Creates a new Regression that fits as close as possible the data and shows it on
	 * the graph.
	 * @param lr the learning rate for the optimization algorithm.
	 */
	function optimizeRegression(lr: number, epoch: number): string | void {
		if (!func.current) return;
		const optimizer: PolyOptimizer = new PolyOptimizer(
			func.current,
			lr,
			epoch,
			RegressionOptimizer.costMSE,
		);
		func.current = optimizer.optimize(data);
		showRegression();
		return func.current.paramsToString();
	}

	/**
	 * Evaluates the model with the value specified and returns the result.
	 * @param x the input of the model.
	 * @returns the output of the model.
	 */
	function evaluate(x: number): number {
		if (pointsOnGraph) setDataOnGraph(mainDataset);
		showRegression();
		return func.current!.compute(x);
	}

	return (
		<>
			<StyledAliveLevel>
				<Row className="h-100">
					{/* Left Side of screen */}
					<Col className="left-col" md={6}>
						{/* Barre d'infos du niveau */}
						<LevelToolsBar />
						{/* Interface de code */}
						{editMode ? (
							/* Interface du code avec les tabs */
							<LineInterface
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
								initialContent={initialCode}
								handleChange={lineInterfaceContentChanges}
							/>
						)}
					</Col>

					{/* Right Side of screen 
							Contains the graph and the console
					*/}
					<Col md={6} style={{ resize: 'both', padding: '0' }}>
						<Row className="data-section">
							<Col md={3}>
								<LevelTable
									data={data}
									xData="Énergie utilisée (kWh)"
									yData="Distance parcourue (km)"
								/>
							</Col>
							<Col md={8} style={{ padding: '0' }}>
								<div className="graph-container">
									<LevelGraph
										data={chartData}
										title="Distance parcourue selon l'énergie utilisée"
										xAxis="Énergie utilisée (kWh)"
										yAxis="Distance parcourue (km)"
									/>
								</div>
							</Col>
						</Row>
						<Row className="command">
							<Cmd ref={cmdRef}></Cmd>
						</Row>
					</Col>
				</Row>
			</StyledAliveLevel>
		</>
	);
};

export default LevelAI;