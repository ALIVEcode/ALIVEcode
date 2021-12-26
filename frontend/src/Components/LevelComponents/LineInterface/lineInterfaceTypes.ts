import styled from 'styled-components';
import { Theme } from '../../../state/contexts/ThemeContext';
export type LineInterfaceProps = {
	handleChange: (content: any) => void;
	hasTabs?: boolean;
	tabs?: EditorTabModel[];
	initialContent?: string;
};

export type EditorTabModel = {
	title: string;
	open: boolean;
	loaded?: boolean;
	defaultContent?: string;
	content?: string;
	onChange?: (content: string) => void;
};

export const StyledLineInterface = styled.div`
	flex: 1 1 auto;
	height: 100%;
	${({ theme }: { theme: Theme }) =>
		theme.name === 'light'
			? 'color: var(--background-color);'
			: 'color: var(--foreground-color);'}

	.hidden-editor {
		display: none;
	}

	.ace-editor {
		font-size: large;
	}

	.ace-cobalt .ace_gutter {
		${({ theme }: { theme: Theme }) =>
			theme.name === 'light'
				? 'background-color: #013677;'
				: 'background-color: var(--primary-color);'}
		color: white;
	}

	.ace-cobalt {
		background-color: black;
	}

	.ace-cobalt .ace_scroller {
		${({ theme }: { theme: Theme }) =>
			theme.name === 'light'
				? 'background-color: #13498F;'
				: 'background-color: rgba(var(--primary-color-rgb), 0.8);'}
	}
	.ace-cobalt .ace_cursor {
		color: var(--foreground-color);
	}
	.ace-cobalt .ace_marker-layer .ace_selection {
		${({ theme }: { theme: Theme }) =>
			theme.name === 'light'
				? 'background-color: #5B8BC7;'
				: 'background-color: #5b8bc7;'}
	}
	.ace-cobalt.ace_multiselect .ace_selection.ace_start {
		box-shadow: 0 0 3px 0px #272822;
	}
	.ace-cobalt .ace_marker-layer .ace_step {
		background: rgb(102, 82, 0);
	}
	.ace-cobalt .ace_marker-layer .ace_bracket {
		margin: -1px 0 0 -1px;
		border: 1px solid #49483e;
	}
	.ace-cobalt .ace_marker-layer .ace_active-line {
		${({ theme }: { theme: Theme }) =>
			theme.name === 'light'
				? `background-color: #013677;`
				: `background-color: var(--primary-color);`}
	}
	.ace-cobalt .ace_gutter-active-line {
		background-color: var(--contrast-color);
	}
	.ace-cobalt .ace_marker-layer .ace_selected-word {
		border: 1px solid #49483e;
	}
	.ace-cobalt .ace_invisible {
		color: #52524d;
	}
	.ace-cobalt .ace_entity.ace_name.ace_tag,
	.ace-cobalt .ace_keyword,
	.ace-cobalt .ace_meta.ace_tag,
	.ace-cobalt .ace_storage {
		color: #f92672;
	}
	.ace-cobalt .ace_punctuation,
	.ace-cobalt .ace_punctuation.ace_tag {
		color: var(--foreground-color);
	}
	.ace-cobalt .ace_constant.ace_character,
	.ace-cobalt .ace_constant.ace_language,
	.ace-cobalt .ace_constant.ace_numeric,
	.ace-cobalt .ace_constant.ace_other {
		color: #ae81ff;
	}
	.ace-cobalt .ace_invalid {
		color: var(--foreground-color);
		background-color: #f92672;
	}
	.ace-cobalt .ace_invalid.ace_deprecated {
		color: var(--foreground-color);
		background-color: #ae81ff;
	}
	.ace-cobalt .ace_support.ace_constant,
	.ace-cobalt .ace_support.ace_function {
		color: #66d9ef;
	}
	.ace-cobalt .ace_fold {
		background-color: #a6e22e;
		border-color: var(--foreground-color);
	}
	.ace-cobalt .ace_support.ace_class {
		color: #fd971f;
	}
	.ace-cobalt .ace_storage.ace_type,
	.ace-cobalt .ace_support.ace_type {
		${({ theme }: { theme: Theme }) =>
			theme.name === 'light' ? 'color: #139DB9;' : 'color: #536bcc;'}
	}
	.ace-cobalt .ace_entity.ace_name.ace_function,
	.ace-cobalt .ace_entity.ace_other,
	.ace-cobalt .ace_entity.ace_other.ace_attribute-name,
	.ace-cobalt .ace_variable {
		color: #a6e22e;
	}
	.ace-cobalt .ace_variable.ace_parameter {
		font-style: italic;
		color: #fd971f;
	}
	.ace-cobalt .ace_string {
		color: #fffb40;
	}
	.ace-cobalt .ace_comment {
		color: #fffb40;
	}
	.ace-cobalt .ace_indent-guide {
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWPQ0FD0ZXBzd/wPAAjVAoxeSgNeAAAAAElFTkSuQmCC)
			right repeat-y;
	}
`;