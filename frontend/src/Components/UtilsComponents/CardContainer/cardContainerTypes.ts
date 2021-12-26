import styled from 'styled-components';
import { Theme } from '../../../state/contexts/ThemeContext';

export type StyledCardContainerProps = {
	scrollX?: boolean;
	scrollY?: boolean;
	titleSize?: string;
	height?: string;
};

export type CardContainerProps = {
	title?: string;
	style?: any;
	className?: string;
	icon?: any;
	height?: string;
	onIconClick?: any;
	scrollX?: boolean;
	scrollY?: boolean;
	children?: React.ReactNode;
	titleSize?: string;
	asRow?: boolean;
};

export const StyledCardContainer = styled.div`
	text-align: center;
	margin-top: 50px;
	position: relative;

	.card-container-title {
		font-size: ${({ titleSize }: StyledCardContainerProps) =>
			titleSize || '26px'};
		border-top-left-radius: 25px;
		border-top-right-radius: 25px;
		background-color: var(--primary-color);
		${({ theme }: { theme: Theme }) =>
			theme.name === 'light'
				? 'color: var(--background-color);'
				: 'color:var(--foreground-color)'}
		margin-bottom: 0px;
		padding: 10px;
	}

	.card-container-body {
		overflow-x: ${({ scrollX }: StyledCardContainerProps) =>
			scrollX ? 'scroll' : 'auto'};
		overflow-y: ${({ scrollY }: StyledCardContainerProps) =>
			scrollY ? 'scroll' : 'auto'};
		border-bottom-left-radius: 25px;
		border-bottom-right-radius: 25px;
		background-color: rgba(var(--background-color-rgb), 0.75);
		box-shadow: 0px 15px 30px 0px rgb(170, 170, 170);
		min-height: ${({ height }: StyledCardContainerProps) => height ?? 'auto'};
		padding: 20px;
	}

	.card-container-body-centered {
		min-height: ${({ height }: StyledCardContainerProps) => height ?? 'auto'};
	}

	.card-container-row {
		justify-content: center;
	}
`;