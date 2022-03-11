import { Editable, Slate, withReact } from 'slate-react';
import { createEditor, Descendant, Editor, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { KeyboardEventHandler, useCallback, useMemo, useState } from 'react';
import InvisibleElement from '../RichTextElements/InvisibleElement';
import DefaultElement from '../RichTextElements/DefaultElement';
import RichTextToolBar from './RichTextToolBar';

const RichTextEditor = () => {
	const editor = useMemo(() => withReact(withHistory(createEditor())), []);
	const [value, setValue] = useState<Descendant[]>([
		{
			type: 'paragraph',
			children: [{ text: 'Hey!' }],
		},
	]);

	const handleOnKeyDown: KeyboardEventHandler<HTMLDivElement> = event => {
		if (!event.ctrlKey) return;

		switch (event.key) {
			case 'b':
				// Prevent the "qs" from being inserted by default.
				event.preventDefault();
				// Otherwise, set the currently selected blocks type to "code".
				const [match] = Editor.nodes(editor, {
					match: (n: any) => n.type === 'invisible',
				});
				// Toggle the block type depending on whether there's already a match.
				Transforms.setNodes(
					editor,
					{ type: match ? 'paragraph' : 'invisible' },
					{
						match: n => Editor.isBlock(editor, n),
						split: true,
					},
				);
				break;
		}
	};

	const renderElement = useCallback(props => {
		switch (props.element.type) {
			case 'invisible':
				return <InvisibleElement {...props} />;
			default:
				return <DefaultElement {...props} />;
		}
	}, []);

	return (
		<div className="flex justify-center w-full h-full bg-[color:var(--background-color)]">
			<div className="pt-20">
				<Slate
					editor={editor}
					value={value}
					onChange={value => {
						setValue(value);
					}}
				>
					<RichTextToolBar />
					<Editable renderElement={renderElement} onKeyDown={handleOnKeyDown} />
				</Slate>
			</div>
		</div>
	);
};

export default RichTextEditor;
