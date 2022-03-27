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
} from './richTextToolBarTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faEye, faItalic } from '@fortawesome/free-solid-svg-icons';
import { Popup } from 'reactjs-popup';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';
import {
	MarkButton,
	toggleMark,
} from '../RichTextElements/RichTextSyleElements';

/**
 * Some code from {@link https://github.com/ianstormtaylor/slate/blob/main/site/examples/hovering-toolbar.tsx}
 * @constructor
 */
const RichTextToolBar = ({}: RichTextToolBarProps) => {
	const ref = useRef<HTMLDivElement>(null);
	const editor = useSlate();
	const update = useForceUpdate();
	const inFocus = useFocused();
	const selectedRec = useRef<{ left: number; top: number }>();

	useLayoutEffect(() => {
		const selection = window.getSelection();
		if (
			!selection ||
			selection.rangeCount < 1 ||
			selection.isCollapsed ||
			!inFocus
		) {
			selectedRec.current = undefined;
			update();
			return;
		}
		let range = selection.getRangeAt(0);
		const rect = range.getBoundingClientRect();
		if (selectedRec.current === undefined) {
			selectedRec.current = {
				left: rect.left - (ref.current?.getBoundingClientRect().left ?? 0),
				top: rect.top - (ref.current?.getBoundingClientRect().top ?? 0) - 40,
			};
		}
		update();
	}, [editor.selection, inFocus]);

	return (
		<div
			ref={ref}
			className="absolute z-[1000] transition-opacity delay-75 ease-in-out"
			style={{
				left: selectedRec.current?.left ?? 0,
				top: selectedRec.current?.top ?? 0,
			}}
		>
			{selectedRec.current && (
				<div className="rounded-sm flex flex-row bg-[color:var(--background-color)] px-1 border drop-shadow-md shadow-gray-500">
					<MarkButton icon={faBold} styleChange="bold" />
					<MarkButton icon={faItalic} styleChange="italic" />
					<MarkButton icon={faEye} styleChange="invisible" />
				</div>
			)}
		</div>
	);
};

export default RichTextToolBar;
