import { useMemo, useState } from 'react';
import { Editable, Slate, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { createEditor, Descendant } from 'slate';
import RichTextDocumentToolBar from './RichTextDocumentToolBar';
import { RichTextDocumentProps } from './richTextDocumentTypes';
import { useTranslation } from 'react-i18next';
import {
	renderElement,
	renderLeaf,
} from '../RichTextElements/RichTextSyleElements';

/**
 * RichTextDocument component is used to render the rich text document.
 * In this component we are using the slate-react library to write down rich text.
 *
 * @param defaultText - The default text to be displayed in the editor.
 * @param onChange - The function to be called when the editor changes.
 * @param readOnly - The flag to determine if the editor is read only or not.
 * @constructor
 */
const RichTextDocument = ({
	defaultText,
	onChange,
	readOnly = false,
}: RichTextDocumentProps) => {
	// @ts-ignore
	const editor = useMemo(() => withReact(withHistory(createEditor())), []);
	const [editMode, setEditMode] = useState(false); // The flag to determine if the editor is in edit mode or not.

	const [value, setValue] = useState<Descendant[]>(defaultText); // The value of the editor.

	const { t } = useTranslation();

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
				{/*page*/}
				<div className="rounded-sm pl-2 bg-[color:var(--background-color)] cursor-text border border-[color:var(--bg-shade-two-color)] py-3 w-full h-full drop-shadow-md">
					{!readOnly && <RichTextDocumentToolBar />}
					<Editable
						placeholder={t('course.start_writing')}
						readOnly={readOnly}
						renderElement={props => renderElement(props as any)}
						// @ts-ignore - The type of the renderLeaf function is not correct.
						renderLeaf={props =>
							// @ts-ignore
							props?.leaf['invisible']
								? !readOnly && renderLeaf(props as any)
								: renderLeaf(props as any)
						}
						onKeyDown={event => event.stopPropagation()}
						onSelect={() => setEditMode(true)}
						onBlur={() => setEditMode(false)}
						aria-expanded
					/>
				</div>
			</Slate>
		</div>
	);
};

export default RichTextDocument;
