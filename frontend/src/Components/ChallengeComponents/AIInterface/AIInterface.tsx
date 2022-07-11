import { useContext, useState } from 'react';
import {
	AIInterfaceProps,
	AITabModel,
	StyledAIInterface,
} from './AIInterfaceTypes';
import { ThemeContext } from '../../../state/contexts/ThemeContext';
import AITab from './AITab';
import ChallengeTable from '../ChallengeTable/ChallengeTable';
import { MODEL_TYPES } from '../../../Models/Ai/ai_model.entity';
import { AICanvas } from './AIVisualModels/AIVisualNeuralNet/AICanvas';
import {
	NNHyperparameters,
	PERCHyperparameters,
} from '../../../Pages/Challenge/ChallengeAI/artificial_intelligence/AIUtilsInterfaces';
import GradientDescentScheme from './AIOptimizers/GradientDescent/GradientDescentScheme';
import { GenHyperparameters } from '../../../../../backend/dist/src/models/ai/entities/AIUtilsInterfaces';
/**
 * This component represents the visual interface in every ChallengeAI. It handles the
 * management of all 4 tabs in this component.
 *
 * @param handleHyperparamChange a callback function called when a hyperparameter is changed in
 * the hyperparameters tab.
 * @param handleModelChange a callback function called when the Model is changed in the hyperparameters tab.
 * @param handleIOChange a callback function called when the inputs or outputs are changed in the data tab.
 * @param className the names of optional CSS classes.
 * @param tabs the tab components of the AIInterface.
 * @param ioCodes the inputs and output codes for the data table.
 * @param activeIoCodes the current inputs and output codes for the data table.
 * @param hyperparams the initial hyperparameter values for the hyperparameters table.
 * @param data the current dataset used for the challenge.
 * @param initData the dataset linked to this challenge in the backend.
 * @param modelType the current model type of the challenge.
 *
 * @author Félix Jobin
 */
const AIInterface = ({
	handleHyperparamChange,
	handleModelChange,
	handleIOChange,
	ioCodes,
	activeIoCodes,
	className,
	tabs: initialTabs,
	data,
	initData,
	modelType,
	modelParams,
	hyperparams,
	activeModel,
}: AIInterfaceProps) => {
	// The selected theme to apply to this component
	const { theme } = useContext(ThemeContext);

	// The tab icons to display on the interface
	const [tabs, setTabs] = useState<AITabModel[]>(() => {
		return (
			initialTabs || [
				// If the tabs array was empty
				{
					title: 'New tab',
					open: true,
				},
			]
		);
	});

	/**
	 * Updates the state of every tab icon and the content
	 * shown in the parent component.
	 * @param idx the opened tab's index.
	 */
	const setOpenedTab = (idx: number) => {
		const updatedTabs = tabs.map((t, i) => {
			t.open = i === idx;
			return t;
		});
		setTabs(updatedTabs);
	};

	/**
	 * Handles the model change when the dropdown menu is used in this component.
	 * Also calls the callback function for a model change in its parent component.
	 * @param value the string value of the dropdown.
	 */
	const handleDropdownChange = (value: MODEL_TYPES) => {
		handleModelChange(value);
	};

	function showModel() {
		if (activeModel && modelParams) {
			switch (activeModel) {
				case MODEL_TYPES.NEURAL_NETWORK:
					return (
						<AICanvas
							layerParams={modelParams}
							filter={0}
							maxNeuronPerLayer={10}
							spacing={40}
							hyperparameters={hyperparams as NNHyperparameters}
						/>
					);
				case MODEL_TYPES.PERCEPTRON:
					let hyperparamPerc = hyperparams as PERCHyperparameters;
					let nnHyperparam: NNHyperparameters = {
						nbInputs: hyperparamPerc.nbInputs,
						nbOutputs: hyperparamPerc.nbOutputs,
						neuronsByLayer: [],
						activationsByLayer: [hyperparamPerc.activation],
						costFunction: hyperparamPerc.costFunction,
						learningRate: hyperparamPerc.learningRate,
						epochs: hyperparamPerc.epochs,
						type: hyperparamPerc.type,
					};
					return (
						<AICanvas
							layerParams={modelParams}
							filter={0}
							maxNeuronPerLayer={10}
							spacing={40}
							hyperparameters={nnHyperparam}
						/>
					);
				default:
					break;
			}
		}
		//
		// switch (activeModel) {
		// 	case MODEL_TYPES.NEURAL_NETWORK:
		// 		return <AICanvas filter={0} maxNeuronPerLayer={10} spacing={20} topology={[5, 6, 20, 60, 5]}/>;
		// 	default:
		// 		break;
		// }
	}

	return (
		<StyledAIInterface
			theme={theme}
			className={'h-3/5 w-full flex flex-col ' + className}
		>
			<div className="bg w-full h-full">
				{/*AIInterface tabs*/}
				<div className="ai-tabs w-full items-center overflow-x-auto overflow-y-clip">
					<div className="dropdown-menu w-full">
						<h1 className="head-text">Modèle choisi :</h1>
						<select
							className="dropdown"
							onChange={e => {
								handleDropdownChange(e.target.value as MODEL_TYPES);
							}}
							defaultValue={modelType}
						>
							<option value={MODEL_TYPES.NEURAL_NETWORK}>
								Réseau de neurones
							</option>
							<option value={MODEL_TYPES.POLY_REGRESSION}>Régression</option>
							<option value={MODEL_TYPES.PERCEPTRON}>Perceptron</option>
						</select>
					</div>
					{tabs.map((tab, index) => (
						<div className="w-fit">
							<AITab
								key={index}
								tab={tab}
								setOpen={() => setOpenedTab(index)}
							/>
						</div>
					))}
				</div>
				{tabs[0].open ? (
					<div className="ai-display w-full overflow-auto">
					
						<ChallengeTable
							data={data}
							isData={true}
							initData={initData}
							ioCodes={ioCodes}
							activeIoCodes={activeIoCodes}
							handleIOChange={handleIOChange}
						/>
					</div>
				) : tabs[1].open ? (
					<div className="ai-display w-full overflow-auto right-200">
						{showModel()}
					</div>
				) : tabs[2].open ? (
					<div className="ai-display flex flex-col">
						<h1 className="header h-1/6">Valeurs des hyperparamètres</h1>
						<ChallengeTable
							className="h-5/6"
							isData={false}
							hyperparams={hyperparams}
							handleHyperparamsChange={handleHyperparamChange}
							ioCodes={ioCodes}
							activeIoCodes={activeIoCodes}
							activeModelType={modelType}
						/>
					</div>
				) : (
					<GradientDescentScheme />
				)}
			</div>
		</StyledAIInterface>
	);
};

export default AIInterface;
