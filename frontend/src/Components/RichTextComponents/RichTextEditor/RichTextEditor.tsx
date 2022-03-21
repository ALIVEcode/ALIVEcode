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
	const [mouseUp, setMouseUp] = useState(true);

	return (
		<div className="flex justify-center w-full h-full bg-[color:var(--background-color)]">
			<Slate
				editor={editor}
				value={value}
				onChange={value => {
					setValue(value);
					onChange(value);
				}}
			>
				{mouseUp && <RichTextToolBar />}
				<Editable
					renderElement={props => applyStyle(props.element.type, props)}
					onKeyDown={applyHotKey}
				/>
			</Slate>
		</div>
	);
};

export default RichTextEditor;