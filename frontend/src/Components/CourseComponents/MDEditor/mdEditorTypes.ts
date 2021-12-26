import styled from 'styled-components';

export type MDEditorProps = {
	defaultValue?: string;
	onSave?: (content: string) => void;
};

export const StyledMDEditor = styled.div`
	position: relative;
	border: 1px solid var(--foreground-color);
	background-color: var(--background-color);

	.editor-header {
		display: flex;
		justify-content: space-evenly;
		position: relative;
		border-bottom: 1px solid var(--foreground-color);
		overflow: hidden;
	}

	.editor-header div {
		width: 100%;
		height: 100%;
		padding: 20px;
		text-align: center;
		transition: 100ms ease-in-out;
	}

	.editor-header div:hover {
		background-color: var(--background-hover-color);
		transform: scale(1.1);
	}

	.editor-toolbar {
		display: flex;
		justify-content: space-evenly;
		position: relative;
	}

	.editor-toolbar div {
		width: 100%;
		height: 50%;
		padding: 5px;
		text-align: center;
	}

	.editor-body {
		margin: 20px;
	}

	.editor-footer {
		display: flex;
		justify-content: flex-end;
		position: relative;
		/* border-top: 1px solid var(--foreground-color); */
		padding: 20px;
	}

	textarea {
		/* resize: none; */
		/* overflow: hidden; */
		min-height: 25vh;
		max-height: 60vh;
	}
`;