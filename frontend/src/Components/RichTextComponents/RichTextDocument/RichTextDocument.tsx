import { useMemo, useState } from 'react';
import { Editable, Slate, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { createEditor, Descendant } from 'slate';
import RichTextDocumentToolBar from './RichTextDocumentToolBar';
import { RichTextDocumentProps } from './richTextDocumentTypes';
import {
	renderElement,
	renderLeaf,
} from '../RichTextElements/RichTextSyleElements';

/**
 * Look "page" :
 * 	ombre sous la page
 * 	page blanche
 * 	fond plus foncé
 *
 * @param defaultText
 * @param onChange
 * @param readOnly
 * @constructor
 */
const RichTextDocument = ({
	defaultText,
	onChange,
	readOnly = false,
}: RichTextDocumentProps) => {
	const editor = useMemo(() => withReact(withHistory(createEditor())), []);
	const [editMode, setEditMode] = useState(false);

	const [value, setValue] = useState<Descendant[]>(
		defaultText ?? [{ type: 'paragraph', children: [{ text: '' }] }],
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
				{/*page*/}
				<div className="rounded-sm pl-2 bg-[color:var(--background-color)] cursor-text border border-[color:var(--bg-shade-two-color)] py-3 w-full h-full drop-shadow-md">
					{!readOnly && <RichTextDocumentToolBar />}
					<Editable
						placeholder="Commencer à écrire..."
						readOnly={readOnly}
						renderElement={props => renderElement(props as any)}
						// @ts-ignore
						renderLeaf={props => props?.leaf["invisible"] ? !readOnly && renderLeaf(props as any) : renderLeaf(props as any)}
						onKeyDown={event => {}}
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
