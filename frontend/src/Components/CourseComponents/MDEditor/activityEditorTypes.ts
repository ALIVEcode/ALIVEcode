import { BaseEditor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';
import styled from 'styled-components';

export type CustomElement = { type: string; children: CustomText[] };

export type CustomText = { text: string };
declare module 'slate' {
	interface CustomTypes {
		Editor: BaseEditor & ReactEditor;
		Element: CustomElement;
		Text: CustomText;
	}
}

export type ActivityEditorProps = {
	defaultValue?: CustomElement[];
	isEditable?: () => boolean;
	onSave?: (content: Descendant[]) => void;
};

export const StyledActivityEditor = styled.div`
	position: relative;
	${({ isEditable }: { isEditable: () => boolean }) =>
		isEditable()
			? `border: 1px dotted var(--foreground-color);
	border-radius: 10px;`
			: ``}
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