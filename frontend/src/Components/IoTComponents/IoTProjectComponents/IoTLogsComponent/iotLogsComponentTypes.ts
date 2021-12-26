import styled from 'styled-components';

export const StyledIoTLogsComponent = styled.div`
	position: relative;
	width: 100%;
	margin: 10px;
	background-color: var(--background-color);
	border: 1px solid var(--bg-shade-four-color);
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 10px;

	.log-row {
		width: 100%;
	}

	.log-content {
		position: relative;
		padding: 20px;
		height: 300px;
		width: 100%;
	}

	.log-title {
		font-size: 1.3em;
		border-bottom: 1px solid white;
		margin-bottom: 3px;
	}

	.log-entries {
		position: relative;
		height: 100%;
		overflow-y: scroll;
	}

	.log-entries label {
		display: block;
	}
`;