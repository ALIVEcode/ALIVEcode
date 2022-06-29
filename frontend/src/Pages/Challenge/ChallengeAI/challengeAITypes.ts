import styled from 'styled-components';
import FillContainer from '../../../Components/UtilsComponents/FillContainer/FillContainer';

export interface ChallengeAIProps {
	initialCode?: string;
}

export const StyledAliveChallenge = styled(FillContainer)`
	width: 100%;
	height: 100%;
	position: relative;

	.data-section {
		height: 60%;
		background: var(--databack-color);
		display: flex;
		align-items: flex-start;
		justify-content: space-around;
	}

	.graph-container {
		height: relative;
	}

	.command {
		height: 40%;
	}
`;
