import { Editable, Slate, withReact } from 'slate-react';
import { createEditor, Descendant } from 'slate';
import { withHistory } from 'slate-history';
import { useMemo, useState } from 'react';
import RichTextToolBar from './RichTextToolBar';
import useTextEditor from '../../../state/hooks/useTextEditor';
import { RichTextEditorProps } from './richTextToolBarTypes';
import { classNames } from '../../../Types/utils';

const RichTextEditor = ({
	defaultText,
	onChange,
	readOnly,
}: RichTextEditorProps) => {
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
					readOnly={readOnly}
					className={classNames(
						'rounded-sm pl-2 bg-[color:var(--background-color)] cursor-text border py-3 w-full h-full transition-all',
						editMode && !readOnly && 'drop-shadow-md',
					)}
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
