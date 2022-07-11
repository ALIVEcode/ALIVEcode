import styled from 'styled-components';
import { AIDataset } from '../../../Models/Ai/ai_dataset.entity';
import { OneOf } from '../../../Types/utils';
import {
	GenHyperparameters,
	Hyperparameters,
} from '../../../Pages/Challenge/ChallengeAI/artificial_intelligence/AIUtilsInterfaces';
import { MODEL_TYPES } from '../../../Models/Ai/ai_model.entity';

/**
 * This interface represents every property of a ChallengeTable.
 *
 * @param className the names of optional CSS classes.
 * @param data the dataset to display in the table, if applicable.
 * @param hyperparams the hyperparameters to display in the table, if applicable.
 * @param isData a boolean telling if the table represents a dataset or the hyperparameters.
 *
 * @author Félix Jobin
 */
export type ChallengeTableProps = {
	className?: string;
	initData?: AIDataset;
	isData: boolean;
	ioCodes: number[];
	activeIoCodes: number[]
} & OneOf<
	{
		data: AIDataset;
		handleIOChange: (activeNewIO: number[],newIO: number[]) => void;
	},
	{
		hyperparams: Hyperparameters;
		activeModelType: MODEL_TYPES;
		handleHyperparamsChange: (newHyperparams: Hyperparameters) => void;
	}
>;

/**
 * This component represents the name associated with his hyperparam
 */
export const HyperparamID: any = {
	nbInputs: {
		name: "Nombre de paramètres d'entrée",
		componant: 'disable integer input',
	}, //
	nbOutputs: {
		name: 'Nombre de paramètres de sortie',
		componant: 'disable integer input',
	}, //
	neuronsByLayer: {
		name: 'Nombre de neurones par couche',
		componant: 'multiple inputs',
	},
	activationsByLayer: {
		name: "Fonction d'activation par couche",
		componant: 'multiple ACTIVATION_FUNCTIONS',
	},
	costFunction: {
		name: 'Fonction de coût',
		componant: 'COST_FUNCTIONS',
	},
	learningRate: {
		name: "Taux d'apprentissage",
		componant: 'input',
	},
	epochs: { name: "Nombre d'epochs", componant: 'integer input' }, //
	type: {
		name: "Type d'optimiseur",
		componant: 'NN_OPTIMIZER_TYPES',
	},
	modelParams: {
		name: 'Paramètres du modèle',
		componant: 'input',
	},
	activation:{
		name: "Fonction d'activation",
		componant: 'ACTIVATION_FUNCTIONS',
	}
};

/**
 * This component represents the CSS code for every ChallengeTable component.
 *
 * @author Félix Jobin
 */
export const StyledChallengeTable = styled.div`
	.body {
		font-size: 11px;
		border-style: none;
		color: #0066CC;
		text-align: center;
		margin-bottom: 0;
		width: 100%;
		
		

	}

	.titles {
		background-color: #2E75FF; 
		border-left: 0.1vh solid ;
		border-right: 0.1vh solid ;
		border-top: 0.1vh solid;
		padding: 5px;
		position: sticky;
		top: 0;
		border-color: #0066CC;
		
	}

	.data-header {
		height: 80px;
	
	}

	.param-name {
		font-size: 14px;
		padding-bottom: 5px;
		line-height: 15px;
		font-weight: bolder;
	}

	
	.hyperparam-header {
		height: 40px;
		font-size: 20px;
		font-weight: bolder;
		color : white; 
		
	
	}

	.data {
		background-color: #f1f5f9;
		/*border: 0.1vh solid var(--databack-color);*/
		border-left: 0.1vh solid ;
		border-right: 0.1vh solid ;
		border-top: 0.1vh solid;
		font-size: 12px;
		max-width: 10vw;
		border-color: #318ce7;
	}

	.hyperparam-data {
		/*border-top: 0.1vh solid var(--databack-color);*/
		border-color: #318ce7;
		border-left: 0.1vh solid ;
		border-right: 0.1vh solid ;
		border-top: 0.1vh solid;
		background-color: #f1f5f9;

	}

	.data-number {
		background-color: var(--secondary-color);
	}

	.hyperparam-name {
		font-weight: bold;
		font-size: 14px;
	
	}

	.inputs {
		background-color: var(--tableback-color);
		text-align: center;
		border: 2px solid white;
		border-radius: 6px;
		font-size: 12px;
		padding: 2px;
	}
	
	td {
		padding: 6px;
		text-align: center;
		justify-content: center;
		font-size: 14px;
		border: #0066CC;
		
	}

	.input-header {
		background-color: #b8e6bf/*a compléter*/ ;
	}

	.input-data {
		background-color: #b8e6bf ;
	}

	.output-data {
		background-color: var(--output-data-color);
	}
	/*.button1 {
	width: 41.666667%;
	border-radius: 15px 50px; 
 	font-size:  16px ;
    line-height:  24px ;
    color: rgb(255 255 255 / var(--tw-text-opacity));
    font-weight: 500;
    font-size:  16px ;
    line-height:  24px ;
	font-weight: 500;
  	transition-property: color, 
	background-color, border-color, text-decoration-color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
	background-color: var(--contrast-color);*/

	}
	.output-header {
		background-color: var(--output-header-color);
	}
`;
