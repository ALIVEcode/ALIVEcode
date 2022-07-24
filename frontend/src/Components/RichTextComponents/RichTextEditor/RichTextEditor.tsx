import { Editable, Slate, withReact } from 'slate-react';
import { createEditor, Descendant } from 'slate';
import { withHistory } from 'slate-history';
import { useMemo, useState } from 'react';
import RichTextToolBar from './RichTextToolBar';
import { RichTextEditorProps } from './richTextToolBarTypes';
import { classNames } from '../../../Types/utils';
import { useTranslation } from 'react-i18next';
import {
	renderElement,
	renderLeaf,
} from '../RichTextElements/RichTextSyleElements';

/**
 * The editor for the "portable" rich text editor (like in headers and footers)
 *
 * @param defaultText The default text to be displayed in the editor
 * @param onChange The function to be called when the editor changes
 * @param readOnly Whether the editor is read only or not
 * @constructor
 *
 * @author Mathis Laroche
 */
const RichTextEditor = ({
	defaultText,
	onEditorChange,
	readOnly,
	onBlur,
	onEditorBlur,
	...other
}: RichTextEditorProps) => {
	// @ts-ignore
	const editor = useMemo(() => withReact(withHistory(createEditor())), []);
	const [editMode, setEditMode] = useState(false);
	const { t } = useTranslation();

	const [value, setValue] = useState<Descendant[]>(
		defaultText ?? [
			{
				// @ts-ignore
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
		<div
			className={`flex bg-[color:var(--background-color)] `}
			onBlur={e => {
				onBlur && onBlur(e);
				onEditorBlur && onEditorBlur(value);
			}}
			{...other}
		>
			<Slate
				editor={editor}
				value={value}
				onChange={value => {
					setValue(value);
					onEditorChange && onEditorChange(value);
				}}
			>
				<RichTextToolBar />
				<Editable
					readOnly={readOnly}
					placeholder={!readOnly ? t('course.start_writing') : undefined}
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
