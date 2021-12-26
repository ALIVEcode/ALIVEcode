import styled from 'styled-components';
import { Theme, themes } from '../../../state/contexts/ThemeContext';
export type ActivityContentProps = {};

export const StyledActivityContent = styled.div`
	position: relative;
	height: 100%;

	transition: 0.35s;
	width: 100%;
	left: 0;
	${({ navigationOpen }: { navigationOpen: boolean }) =>
		navigationOpen &&
		`
			width: calc(100% - 20vw);
			left: 20vw;
		`}

	.btn-toggle-nav {
		position: fixed;
		padding-top: 15px;
		padding-bottom: 15px;
		margin-top: calc(20% - (23px / 2));
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}

	.activity-header {
		border-bottom: 2px solid var(--foreground-color);
		padding: 0 0 10px 0;
		margin-bottom: 25px;
		display: flex;
		align-items: center;
	}

	.activity-header-title {
		font-size: 2.5em;
		margin-right: 20px;
	}

	.activity-content-padding {
		padding: 30px;
		height: 100%;
	}

	.activity-content-body {
		height: 100%;
		padding: 20px;
		border-radius: 5px;
		overflow-y: auto;
		${({ theme }: { theme: Theme }) =>
			theme.name === themes.light.name &&
			'background-color: rgba(var(--background-color-rgb), 1);'}
	}
`;