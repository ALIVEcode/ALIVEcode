import { Editable, Slate, useFocused, withReact } from 'slate-react';
import { createEditor, Descendant, Editor, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import {
	KeyboardEventHandler,
	useCallback,
	useMemo,
	useRef,
	useState,
} from 'react';
import RichTextToolBar from './RichTextToolBar';
import useTextEditor from '../../../state/hooks/useTextEditor';
import { RichTextEditorProps } from './richTextToolBarTypes';

const RichTextEditor = ({ defaultText, onChange }: RichTextEditorProps) => {
	const editor = useMemo(() => withReact(withHistory(createEditor())), []);
	const { applyHotKey, applyStyle } = useTextEditor(editor);
	const [editMode, setEditMode] = useState(false);

	const [value, setValue] = useState<Descendant[]>(
		defaultText ?? [
			{
				type: 'paragraph',
				children: [
					{
						text:
							'Lorem, ipsum ' +
							'dolor sit amet consectetur adipisicing elit. Ad accusamus voluptatibus eum consequuntur,' +
							' assumenda facilis repellat ipsum beatae hic quidem laborum provident nulla repellendus debi' +
							'tis quam nihil, repudiandae suscip' +
							'it itaque?',
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
					className={`rounded-sm pl-2 bg-[color:var(--background-color)] cursor-text border py-3 w-full h-full ${
						editMode && 'drop-shadow-md'
					}`}
					renderElement={props => applyStyle(props.element.type, props)}
					onKeyDown={applyHotKey}
					onSelect={() => setEditMode(true)}
					onBlur={() => setEditMode(false)}
				/>
				{/**/}
			</Slate>
		</div>
	);
};

export default RichTextEditor;
