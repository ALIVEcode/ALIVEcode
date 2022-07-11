/**
 * This interface defines all appliable types for objects representing data.
 */
export default interface DataPoint {
	type: string;
	label: string;
	data: (
		| {
				id: number;
				x: number;
				y: number;
		  }
		| {}
	)[];
	backgroundColor?: string;
	borderColor?: string;
	borderWidth?: number;
	pointRadius?: number;
	pointBorderWidth?: number;
	pointBackgroundColor?: string;
}
