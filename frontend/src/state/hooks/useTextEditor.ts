import { Editor, Text, Transforms } from 'slate';
import { KeyboardEvent } from 'react';
import {
	BoldElement,
	DefaultElement,
	InvisibleElement,
	ItalicElement,
} from '../../Components/RichTextComponents/RichTextElements/RichTextSyleElements';

import {
	richTextStyles,
	StyleElementProps,
} from '../../Components/RichTextComponents/RichTextEditor/richTextToolBarTypes';

const styles: {
	[name in richTextStyles]: (props: StyleElementProps) => JSX.Element;
} = {
	invisible: InvisibleElement,
	italic: ItalicElement,
	bold: BoldElement,
	emphasis: props => ItalicElement({ ...props, children: BoldElement(props) }),
};

const hotkeys: {
	[hotkey: string]: richTextStyles;
} = {
	i: 'italic',
	b: 'bold',
};

const useTextEditor = (editor: Editor) => {
	const applyStyle = (style: string, props: StyleElementProps) => {
		return style in styles
			? styles[style as richTextStyles](props)
			: DefaultElement(props);
	};

	const applyHotKey = (event: KeyboardEvent<HTMLDivElement>) => {
		if (!event.ctrlKey || !(event.key in hotkeys)) return;

		event.preventDefault();

		const style = hotkeys[event.key as richTextStyles];

		changeStyle(style);
	};

	const changeStyle = (style: richTextStyles) => {
		const [match] = Editor.nodes(editor, {
			match: (n: any) => n.type === style,
		});
		// Toggle the block type depending on whether there's already a match.
		Transforms.setNodes(
			editor,
			{ type: match ? 'paragraph' : style },
			{
				match: n => Editor.isBlock(editor, n),
				split: true,
			},
		);
	};

	return { applyStyle, applyHotKey, changeStyle };
};

export default useTextEditor;
