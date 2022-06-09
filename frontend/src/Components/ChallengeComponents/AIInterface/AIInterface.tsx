import {
	memo,
	useContext,
	useRef,
	useState,
	useCallback,
	useEffect,
} from 'react';
import {
	AIInterfaceProps,
	AITabModel,
	StyledAIInterface,
} from './AIInterfaceTypes';
import { ThemeContext } from '../../../state/contexts/ThemeContext';
import AITab from './AITab';
import ChallengeTable from '../ChallengeTable/ChallengeTable';
import { MODEL_TYPES } from '../../../Models/Ai/ai_model.entity';
import { ThreeScene } from './AIVisualModels/AINeuralNet';
import {
	GenHyperparameters,
	Hyperparameters,
} from '../../../Pages/Challenge/ChallengeAI/artificial_intelligence/AIUtilsInterfaces';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';
import useComplexState from '../../../state/hooks/useComplexState';
import { defaultModelType } from '../../../Pages/Challenge/ChallengeAI/artificial_intelligence/ai_models/DefaultHyperparams';

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
	className,
	tabs: initialTabs,
	data,
	initData,
	modelType,
	hyperparams,
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
							ioCodes={ioCodes!}
							handleIOChange={handleIOChange}
						/>
					</div>
				) : tabs[1].open ? (
					<div className="ai-display w-full overflow-auto right-200">
						<ThreeScene />
						<div
							className={
								'absolute top-[9%] right-[2%] bg-black text-base p-5 hidden'
							}
							id={'SelectedValue'}
						>
							Content
						</div>
					</div>
				) : tabs[2].open ? (
					<>
						<h1 className="header h-1/6">Valeurs des hyperparamètres</h1>
						<ChallengeTable
							className="h-5/6"
							isData={false}
							hyperparams={hyperparams}
							handleHyperparamsChange={handleHyperparamChange}
							ioCodes={ioCodes}
							activeModelType={modelType}
						/>
					</>
				) : (
					<div />
				)}
			</div>
		</StyledAIInterface>
	);
};

export default AIInterface;
