/**
 * This interface defines all properties of a challenge graph.
 *
 * - data: the data to show on the graph
 * - title: the title of the graph
 * - xAxis: the label of the X axis on the graph
 * - yAxis: the label of the Y axis on the graph
 */
export interface ChallengeGraphProps {
	data: any;
	className?: string;
	title: string;
	xAxis: string;
	yAxis: string;
}
