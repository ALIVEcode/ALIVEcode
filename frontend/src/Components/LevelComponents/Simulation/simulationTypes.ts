import styled from 'styled-components';

export type SimulationProps = {
	init: (s: any) => void;
	onChange: (layout: any) => void;
	stopExecution: () => void;
	setShowConfetti: (set: boolean) => void;
	id: string;
};

export const StyledSimulation = styled.div`
	width: 100%;

	.zoom-button {
		position: absolute;
		right: 0;
		top: 0;
	}

	.fullscreen-div {
		position: fixed;
		z-index: 100;
		left: 0;
		display: none;
	}
`;