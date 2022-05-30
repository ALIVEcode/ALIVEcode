import { useState } from 'react';
import {
	ChallengeTableProps,
	StyledChallengeTable,
	HyperparamID,
} from './challengeTableTypes';

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
		return (HyperparamID![key])
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
									<input
										className="inputs"
										onBlur={e => updateHyperparams(e.target.value, key)}
										defaultValue={props.hyperparams![key]}
									></input>
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
