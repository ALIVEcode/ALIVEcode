import { useState, useRef } from 'react';
import {
	ChallengeTableProps,
	StyledChallengeTable,
	HyperparamID,
} from './challengeTableTypes';

import {
	COST_FUNCTIONS,
	ACTIVATION_FUNCTIONS,
	NN_OPTIMIZER_TYPES,
	MODEL_TYPES,
} from '../../../Models/Ai/ai_model.entity';
import { getSystemErrorMap } from 'util';

/**
 * This module defines all properties related to the data table in AI challenges.
 * The structure of the table is described in this object while the style of
 * the table is set in ChallengeTableTypes.
 * @param props the props of the table
 * @returns
 */
const ChallengeTable = (props: ChallengeTableProps) => {
	const [currHyperparams, setCurrHyperparams] = useState<any>(
		props.hyperparams,
	);

	const [ioCodes, setIOCodes] = useState<number[]>()

	function initIOCodes(){
		
			if(props.data && props.isData){
				var array:number[] = []
				for (let i = 0; i< props.data.paramNames.length; i++){
					array.push(-1)
				}
				setIOCodes(array)
				props.handleIOChange!(array)
			}
		
		
	}


	function updateHyperparams(
		e: React.FocusEvent<HTMLInputElement, Element>,
		newValue: any,
		key: string,
	): void {
		if (HyperparamID![key]['componant'] == 'integer input') {
			e.target.value = Number(parseInt(newValue)).toString();
			newValue = e.target.value;
		}
		let tempHyperparams: any = currHyperparams;
		console.log(newValue);
		tempHyperparams[key] = newValue;
		setCurrHyperparams(tempHyperparams);
		props.handleHyperparamsChange!(currHyperparams);
	}

	/**
	 * Returns a component representing the headers of this ChallengeTable
	 * @returns the headers in a component.
	 */
	function renderTableHeaders() {
		initIOCodes()
		if (props.data && props.isData)
			return (
				<tr>
					{props.data.getParamNames().map((param: string, index: number) => {
						return <th 
						className="titles"
						onClick={(event) => {
							console.log(event.currentTarget.cellIndex)
							var i = (ioCodes![event.currentTarget.cellIndex]+2) % 3 - 1
							var array = ioCodes!
							array[event.currentTarget.cellIndex] = i
							setIOCodes(array)
							props.handleIOChange!(array)
							console.log(array);
						}}
						>{param}
						</th>;
					})}		
				</tr>
			);
		if (props.hyperparams && !props.isData)
			return (
				<tr>
					<th className="titles">Hyperparamètre</th>
					<th className="titles">Valeur</th>
				</tr>
			);
	}

	/**
	 * Returns the name associated with the hyperparameter.
	 * @param key the hyperparameter
	 * @returns the name of the hyperparameter
	 */
	function nameHyperparam(key: string) {
		return HyperparamID![key]['name'];
	}

	/**
	 * Returns the step associated with the hyperparameter.
	 * @param key the hyperparameter
	 * @returns the step of the hyperparameter
	 */
	function inputStep(key: string) {
		if (HyperparamID![key]['componant'] == 'input') return '0.01';
		else return '1';
	}

	/**
	 * Returns the component associated with the hyperparameter.
	 * @param key the hyperparameter
	 * @returns the component corresponding to the hyperparameter
	 */
	function addHypperparamInput(key: string) {
		var select = document.getElementById('SelectTypeHyperParameter');

		if (
			HyperparamID![key]['componant'] == 'integer input' ||
			HyperparamID![key]['componant'] == 'input'
		)
			return (
				<input
					className="inputs"
					type="number"
					onBlur={e => updateHyperparams(e, e.target.value, key)}
					defaultValue={props.hyperparams![key]}
					onKeyPress={event => {
						if (
							!(
								/[0-9]/.test(event.key) ||
								/[.]/.test(event.key) ||
								/[,]/.test(event.key)
							)
						) {
							event.preventDefault();
						}
					}}
					step={inputStep(key)}
					min="0"
				></input>
			);
		else var keys: any[];
		var values: any[];

		switch (HyperparamID![key]['componant']) {
			case 'NN_OPTIMIZER_TYPES': {
				values = Object.values(NN_OPTIMIZER_TYPES);
				keys = Object.keys(NN_OPTIMIZER_TYPES);
				break;
			}
			case 'ACTIVATION_FUNCTIONS': {
				values = Object.values(ACTIVATION_FUNCTIONS);
				keys = Object.keys(ACTIVATION_FUNCTIONS);
				break;
			}
			case 'MODEL_TYPES': {
				values = Object.values(MODEL_TYPES);
				keys = Object.keys(MODEL_TYPES);
				break;
			}
			case 'COST_FUNCTIONS': {
				values = Object.values(COST_FUNCTIONS);
				keys = Object.keys(COST_FUNCTIONS);
				break;
			}
			default: {
				values = [];
				keys = [];
			}
		}
		return (
			<select className="inputs">
				{values.map((index: number) => {
					var i = values.indexOf(index);
					return <option value={index}>{keys.at(i)}</option>;
				})}
			</select>
		);
	}

	/**
	 * Returns a component representing the data rows of this ChallengeTable.
	 * @returns the data in a component.
	 */
	function renderTableData() {
		if (props.data && props.isData)
			return (
				<>
					{props.data.getDataForTable().map((dataLine: any, row: number) => {
						return (
							<tr key={row}>
								{dataLine.map((element: any, col: number) => {
									return <td className="data">{element}</td>;
								})}
							</tr>
						);
					})}
				</>
			);
		if (props.hyperparams && !props.isData)
			return (
				<>
					{Object.keys(props.hyperparams).map((key: string, index: number) => {
						return (
							<tr>
								<td className="hyperparam-name data">{nameHyperparam(key)}</td>
								<td className="hyperparam-value data">
									{addHypperparamInput(key)}
								</td>
							</tr>
						);
					})}
				</>
			);
	}

	return (
		<StyledChallengeTable
			className={
				'w-full h-full overflow-x-auto overflow-y-auto ' + props.className
			}
		>
			<table
				className={
					props.isData ? 'body self-center w-full' : 'body self-center w-5/6'
				}
			>
				<tbody>
					{renderTableHeaders()}
					{renderTableData()}
				</tbody>
			</table>
		</StyledChallengeTable>
	);
};

export default ChallengeTable;
