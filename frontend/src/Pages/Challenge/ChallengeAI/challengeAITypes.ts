import styled from 'styled-components';
import FillContainer from '../../../Components/UtilsComponents/FillContainer/FillContainer';

export interface ChallengeAIProps {
	initialCode?: string;
}

export const StyledAIChallenge = styled.div`
	.ai-scroll::-webkit-scrollbar {
		width: 10px;
		height: 10px;
	}

	.ai-scroll::-webkit-scrollbar-thumb {
		background: var(--bg-shade-three-color);
		border-radius: 10px;
	}

	.ai-scroll::-webkit-scrollbar-thumb:hover {
		background: var(--primary-color);
	}
`;
