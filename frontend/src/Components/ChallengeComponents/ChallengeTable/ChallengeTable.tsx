import { useState } from 'react';
import {
	ChallengeTableProps,
	StyledChallengeTable,
	HyperparamID,
} from './challengeTableTypes';

import { 
	COST_FUNCTIONS,
	ACTIVATION_FUNCTIONS,
	NN_OPTIMIZER_TYPES,
	MODEL_TYPES
 } from '../../../Models/Ai/ai_model.entity';


/**
 * This module defines all properties related to the data table in AI challenges.
 * The structure of the table is described in this object while the style of
 * the table is set in ChallengeTableTypes.
 * @param props the props of the table (ChallengeTableProps)
 */
const ChallengeTable = (props: ChallengeTableProps) => {
	const [currHyperparams, setCurrHyperparams] = useState<any>(
		props.hyperparams,
	);

	function updateHyperparams(newValue: any, key: string): void {
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
		if (props.data && props.isData)
			return (
				<tr>
					{props.data.getParamNames().map((param: string, index: number) => {
						return <th className="titles">{param}</th>;
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
	function nameHyperparam(key: string){
		return (HyperparamID![key]["name"])
	}
 
	/**
	 * Returns the component associated with the hyperparameter.
	 * @param key the hyperparameter
	 * @returns the component corresponding to the hyperparameter
	 */
	function composanHyperparam(key: string){

		if (HyperparamID![key]["componant"] =="input")
			return(
				<input
					className="inputs"
					onBlur={e => updateHyperparams(e.target.value, key)}
					defaultValue={props.hyperparams![key]}
				></input>
			)
		else 
			var keys, values
			switch(HyperparamID![key]["componant"]) { 
				case "NN_OPTIMIZER_TYPES": { 
					values = Object.values(NN_OPTIMIZER_TYPES)
					keys = Object.keys(NN_OPTIMIZER_TYPES)
					return(
						<select id="select">
								<option value={values.at(0)}>{keys.at(0)}</option>
						   </select>
				
					)
				break; 
				} 
				case "ACTIVATION_FUNCTIONS": { 
					values = Object.values(ACTIVATION_FUNCTIONS)
					keys = Object.keys(ACTIVATION_FUNCTIONS)
					return(
						<select id="select">
								<option value={values.at(0)}>{keys.at(0)}</option>
								<option value={values.at(1)}>{keys.at(1)}</option>
								<option value={values.at(2)}>{keys.at(2)}</option>
						</select>
				
					)
				break; 
				} case "MODEL_TYPES": { 
					values = Object.values(MODEL_TYPES)
					keys = Object.keys(MODEL_TYPES)
					return(
						<select id="select">
								<option value={values.at(0)}>{keys.at(0)}</option>
								<option value={values.at(1)}>{keys.at(1)}</option>
						   </select>
				
					)
				break; 
				} case "COST_FUNCTIONS": { 
					values = Object.values(COST_FUNCTIONS)
					keys = Object.keys(COST_FUNCTIONS)
					return(
						<select id="select">
								<option value={values.at(0)}>{keys.at(0)}</option>
								<option value={values.at(1)}>{keys.at(1)}</option>
								<option value={values.at(2)}>{keys.at(2)}</option>     			
						 </select>
				
					)
				break; 
				} 
			}
		

	}

	/**
	 * Returns a component representing the data rows of this ChallengeTable.
	 * @returns the data in a component.
	 */
	function renderTableData() {
		if (props.data && props.isData)
			//When this table represents data
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
			//When this table represents hyperparameters
			return (
				<>
					{Object.keys(props.hyperparams).map((key: string, index: number) => {
						return (
							<tr>
								<td className="hyperparam-name data">{nameHyperparam(key)}</td>
								<td className="hyperparam-value data">
									{composanHyperparam(key)}
								</td>
							</tr>
						);
					})}
				</>
			);
	}

	return (
		<StyledChallengeTable className={props.className}>
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
