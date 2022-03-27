import { Descendant, Editor, Range, Transforms } from 'slate';
import {
	MouseEventHandler,
	MutableRefObject,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import { useFocused, useSlate, useSelected } from 'slate-react';
import {
	RichTextToolBarButtonFormatProps,
	RichTextToolBarProps,
} from './richTextDocumentTypes';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faEye, faItalic } from '@fortawesome/free-solid-svg-icons';
import { Popup } from 'reactjs-popup';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';
import { Toolbar } from '../../CourseComponents/ActivityContent/EditorComponents';
import { MarkButton, toggleMark } from '../RichTextElements/RichTextSyleElements';

/**
 * Some code from {@link https://github.com/ianstormtaylor/slate/blob/main/site/examples/hovering-toolbar.tsx}
 * @constructor
 */
const RichTextDocumentToolBar = ({}: RichTextToolBarProps) => {

	const ref = useRef<HTMLDivElement>(null);
	const editor = useSlate();
	const selectedRec = useRef<{ left: number; top: number }>();

	return (
		/*<div
			ref={ref}
			className=""
		>
			{selectedRec.current && (
				<div className="rounded-sm flex flex-row bg-[color:var(--background-color)] px-1 border drop-shadow-md shadow-gray-500">
					<FormatButton icon={faBold} styleChange="bold" />
					<FormatButton icon={faItalic} styleChange="italic" />
					<FormatButton icon={faEye} styleChange="invisible" />
				</div>
			)}
		</div>*/
		<Toolbar className="border-b pb-2 mb-2">
			<MarkButton icon={faBold} styleChange="bold" />
			<MarkButton icon={faItalic} styleChange="italic" />
		</Toolbar>
	);
};

export default RichTextDocumentToolBar;
