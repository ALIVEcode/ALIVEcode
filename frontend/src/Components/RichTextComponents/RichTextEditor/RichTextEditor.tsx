import { Editable, Slate, withReact } from 'slate-react';
import { createEditor, Descendant } from 'slate';
import { withHistory } from 'slate-history';
import { useMemo, useState } from 'react';
import RichTextToolBar from './RichTextToolBar';
import { RichTextEditorProps } from './richTextToolBarTypes';
import { classNames } from '../../../Types/utils';
import {
	renderElement,
	renderLeaf,
} from '../RichTextElements/RichTextSyleElements';

const RichTextEditor = ({
	defaultText,
	onChange,
	readOnly,
}: RichTextEditorProps) => {
	const editor = useMemo(() => withReact(withHistory(createEditor())), []);
	const [editMode, setEditMode] = useState(false);

	const [value, setValue] = useState<Descendant[]>(
		defaultText ?? [
			{
				type: 'paragraph',
				children: [
					{
						text: '',
					},
				],
			},
		],
	);

	return (
		<div className={`flex bg-[color:var(--background-color)] `}>
			<Slate
				editor={editor}
				value={value}
				onChange={value => {
					setValue(value);
					onChange(value);
				}}
			>
				<RichTextToolBar />
				<Editable
					readOnly={readOnly}
					placeholder="Commencer à écrire..."
					className={classNames(
						'rounded-sm pl-2 bg-[color:var(--background-color)] cursor-text border border-[color:var(--bg-shade-two-color)] py-3 w-full h-full transition-all',
						editMode && !readOnly && 'drop-shadow-md',
					)}
					renderElement={props => renderElement(props as any)}
					renderLeaf={props => renderLeaf(props as any)}
					onKeyDown={event => {}}
					onSelect={() => setEditMode(true)}
					onBlur={() => setEditMode(false)}
				/>
				{/**/}
			</Slate>
		</div>
	);
};

export default RichTextEditor;
