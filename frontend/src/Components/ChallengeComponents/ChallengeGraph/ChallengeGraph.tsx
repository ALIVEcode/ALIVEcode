import { ChallengeGraphProps } from './challengeGraphTypes';
import { Scatter } from 'react-chartjs-2';
import { memo } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

/**
 * This constant defines all general characteristics of a graph in AI challenges. The graph is
 * implemented with Chart.js and all of the parameters defining it are set below.
 * @param props the properties of a graph :
 *    - data: a javascript object, the data to present on the graph.
 *    - title: a string, the title of the graph.
 *    - xAxis: a string, the title of the X axis.
 *    - yAxis: a string, the title of the Y axis.
 * @returns the graph itself.
 */
const ChallengeGraph = memo((props: ChallengeGraphProps) => {
	// Chart.defaults.font.size = 12;
	// Chart.defaults.font.weight = 'bold';

	return (
		<div className="w-full h-full flex items-center justify-center p-4 pl-0">
			<Scatter
				color="black"
				className={'graph ' + props.className}
				data={props.data}
				options={{
					responsive: true,
					aspectRatio: 1.3,
					events: [],
					layout: {
						padding: {
							left: 25,
							right: 10,
						},
					},
					scales: {
						x: {
							display: true,
							title: {
								display: true,
								text: props.xAxis,
							},
						},
						y: {
							display: true,
							title: {
								display: true,
								text: props.yAxis,
							},
						},
					},
					plugins: {
						title: {
							display: true,
							text: props.title,
							font: {
								size: 26,
							},
						},
						legend: {
							display: false,
						},
					},
				}}
			/>
		</div>
	);
});

export default ChallengeGraph;
