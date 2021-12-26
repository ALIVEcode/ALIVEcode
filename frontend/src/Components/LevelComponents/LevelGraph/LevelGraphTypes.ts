import styled from 'styled-components';
import FillContainer from '../../UtilsComponents/FillContainer/FillContainer';

/**
 * This interface defines all properties of a level graph.
 *
 * - data: the data to show on the graph
 * - title: the title of the graph
 * - xAxis: the label of the X axis on the graph
 * - yAxis: the label of the Y axis on the graph
 */
export interface LevelGraphProps {
	data: any;
	title: string;
	xAxis: string;
	yAxis: string;
}

export const StyledLevelGraph = styled(FillContainer)`
	.graph-holder {
		margin-bottom: 40vh;
	}
`;
