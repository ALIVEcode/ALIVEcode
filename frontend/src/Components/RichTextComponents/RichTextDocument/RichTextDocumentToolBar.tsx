import { Editor } from 'slate';
import { useRef } from 'react';
import { useSlate } from 'slate-react';
import { RichTextToolBarProps } from './richTextDocumentTypes';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faBold,
	faCircle,
	faCode,
	faEye,
	faHeading,
	faItalic,
	faList,
	faListOl,
	faSquare,
	faUnderline,
} from '@fortawesome/free-solid-svg-icons';
import {
	BlockButton,
	isMarkActive,
	MarkButton,
	replaceMark,
	RichTextButton,
} from '../RichTextElements/RichTextSyleElements';
import { Toolbar } from './EditorComponents';

/**
 * Some code from {@link https://github.com/ianstormtaylor/slate/blob/main/site/examples/hovering-toolbar.tsx}
 * @constructor
 */
const RichTextDocumentToolBar = ({}: RichTextToolBarProps) => {
	const ref = useRef<HTMLInputElement>(null);
	const editor = useSlate();
	const selectedRec = useRef<{ left: number; top: number }>();

	const currentColor = () => {
		const marks = Editor.marks(editor);
		// @ts-ignore
		return (marks && marks['color']) ?? 'black';
	};

	const currentHighlightColor = () => {
		const marks = Editor.marks(editor);
		// @ts-ignore
		return (marks && marks['backgroundColor']) ?? 'black';
	};

	const changeColor = () => {
		if (!ref.current) return;
		const marks = Editor.marks(editor);
		// @ts-ignore
		const previous = marks && marks['color'];
		const color = ref.current.value || previous;
		replaceMark(editor, 'color', 'color', color);
		ref.current.style.visibility = 'invisible';
	};

	return (
		<Toolbar className="border-b pb-2 mb-2">
			<MarkButton icon={faBold} styleChange="bold" />
			<MarkButton icon={faItalic} styleChange="italic" />
			<MarkButton icon={faCode} styleChange="code" />
			<MarkButton icon={faUnderline} styleChange="underline" />
			<MarkButton icon={faEye} styleChange="invisible" />
			<RichTextButton
				active={isMarkActive(editor, 'backgroundColor')}
				onClick={() => {
					const marks = Editor.marks(editor);
					// @ts-ignore
					const previous = marks && marks['backgroundColor'];
					const color = prompt('Pick your color') || previous;
					replaceMark(editor, 'backgroundColor', 'backgroundColor', color);
				}}
			>
				<FontAwesomeIcon
					icon={faSquare}
					size="sm"
					style={{ color: currentHighlightColor() }}
					title="Highlight color"
				/>
			</RichTextButton>
			{/*Color picker*/}
			<RichTextButton
				active={isMarkActive(editor, 'color')}
				onClick={() => {
					const marks = Editor.marks(editor);
					// @ts-ignore
					const previous = marks && marks['color'];
					const color = prompt('Pick your color') || previous;
					replaceMark(editor, 'color', 'color', color);
					// if (!ref.current) return;
					/*ref.current.style.visibility = 'visible';
					ref.current.value = currentColor();
					ref.current.focus();*/
				}}
				showSeparator
			>
				<>
					{/*<form>
						<input
							type="color"
							ref={ref}
							className="absolute invisible "
							onBlur={e => {
								changeColor();
							}}
						/>
					</form>*/}
					<FontAwesomeIcon
						icon={faCircle}
						size="sm"
						style={{ color: currentColor() }}
						title="color"
					/>
				</>
			</RichTextButton>

			<BlockButton icon={faHeading} styleChange="h1" showSeparator />
			<BlockButton icon={faList} styleChange="list_bullet" showSeparator />
			<BlockButton icon={faListOl} styleChange="list_number" showSeparator />
		</Toolbar>
	);
};

export default RichTextDocumentToolBar;
