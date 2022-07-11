import styled from 'styled-components';
import {
	GenHyperparameters,
	Hyperparameters as Hyperparameters,
} from '../../../Pages/Challenge/ChallengeAI/artificial_intelligence/AIUtilsInterfaces';
import { Theme } from '../../../state/contexts/ThemeContext';
import { MODEL_TYPES } from '../../../Models/Ai/ai_model.entity';
import { NNModelParams } from '../../../../../backend/dist/src/models/ai/entities/AIUtilsInterfaces';

/**
 * This type describes all properties of an AIInterface.
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
export type AIInterfaceProps = {
	handleHyperparamChange: (newHyperparams: Hyperparameters) => void;
	handleModelChange: (newModel: MODEL_TYPES) => void;
	handleIOChange: (activeNewIO: number[], newIO: number[]) => void;
	ioCodes: number[];
	activeIoCodes: number[];
	className?: string;
	tabs: AITabModel[];
	data: any;
	activeModel: MODEL_TYPES | undefined;
	hyperparams: Hyperparameters;
	modelType: MODEL_TYPES;
	modelParams?: NNModelParams;
	initData: any;
};

/**
 * This type represents the general properties of an AITab. It is used to
 * keep minimum information on an AITab when passing them as arguments.
 *
 * @param title the tab's title.
 * @param open a boolean telling if the tab is open or closed.
 * @param onChange a callback function called when the tab's state changes.
 *
 * @author Félix Jobin
 */
export type AITabModel = {
	title: string;
	open: boolean;
	onChange?: (content: string) => void;
};

/**
 * This component contains the CSS code related to the AIInterface.
 */
export const StyledAIInterface = styled.div`
	${({ theme }: { theme: Theme }) =>
		theme.name === 'light'
			? 'color: var(--background-color);'
			: 'color: var(--foreground-color)'}

	.bg {
		background-color: #f6f7f7 /*var(--bg-shade-one-color)*/;
	}

	.ai-tabs {
		display: flex;
		height: 12%;
		max-height: 5.5vh;
		background-color:  var(--bg-shade-two-color);
	}

	.ai-display {
		height: 90%;
		background-color: #f0f0f1; /* color of the background */
		
  	
	}

	.header {
		text-align: center;
		font-size: 25px;
		padding: 10px;
		font-weight: bold;
		color: black /*#8c8f94*/;
		text-decoration: underline; 
	}
	

	.dropdown-menu {
		display: flex;
		align-items: center;
		height: max-content;
		margin-right: 0.5vw;
		color:  var(--foreground-color);
	}

	.dropdown {
		font-size: 12px;
		width: 100%;
		border-width: 2px;
		border-color: rgb(59 130 246 / 0.5);
		background-color: rgb(59 130 246 / 0.5);
		margin-top: 50%;
		margin-bottom: 50%;	
	}

	.head-text {
		width: 250px;
		margin-right: 2%;
		margin-left: 0;
		margin-top: 50%;
		margin-bottom: 50%;
		font-size: 100%;
		text-align: right;
		display: inline-block;
		font-weight: 700;
		color: black ; 
	}
`;
