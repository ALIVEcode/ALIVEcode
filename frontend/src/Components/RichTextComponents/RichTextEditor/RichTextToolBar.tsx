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

/**
 * Some code from {@link https://github.com/ianstormtaylor/slate/blob/main/site/examples/hovering-toolbar.tsx}
 * @constructor
 */
const RichTextToolBar = ({}: RichTextToolBarProps) => {
	const FormatButton = ({
		icon,
		styleChange,
		showSeparator = false,
	}: RichTextToolBarButtonFormatProps) => {
		const onClick: MouseEventHandler = event => {
			event.preventDefault();
			const [match] = Editor.nodes(editor, {
				match: (n: any) => n.type === styleChange,
			});

			Transforms.setNodes(
				editor,
				{ type: match ? 'paragraph' : styleChange },
				{
					match: n => Editor.isBlock(editor, n),
					split: true,
				},
			);
		};

		return (
			<div
				className={`px-2 pt-0.5 pb-1 ${
					showSeparator ? 'border-r-2 border-gray-500' : ''
				} hover:bg-[color:var(--bg-shade-four-color)]`}
				onMouseDown={e => e.preventDefault()}
				onClick={onClick}
			>
				<FontAwesomeIcon
					icon={icon}
					size="sm"
					className="[color:var(--foreground-color)]"
					title={styleChange}
				/>
			</div>
		);
	};

	const ref = useRef<HTMLDivElement>(null);
	const editor = useSlate();
	const inFocus = useFocused();
	const update = useForceUpdate();
	const selectedRec = useRef<{ left: number; top: number }>();

	useLayoutEffect(() => {
		let selection = window.getSelection();
		if (
			!ref.current ||
			!selection ||
			selection.rangeCount < 1 ||
			selection.isCollapsed
		) {
			selectedRec.current = undefined;
			update();
			return;
		}
		let range = selection.getRangeAt(0);
		const rect = range.getBoundingClientRect();
		selectedRec.current = selectedRec.current || {
			left: rect.left - ref.current.getBoundingClientRect().left,
			top: rect.top - ref.current.getBoundingClientRect().top - 40,
		};
		update();
	}, [editor.selection, inFocus]);

	return (
		<div
			ref={ref}
			className="absolute z-[1000]"
			style={{
				left: selectedRec.current?.left ?? 0,
				top: selectedRec.current?.top ?? 0,
			}}
		>
			{selectedRec.current !== undefined && (
				<div className="rounded-sm flex flex-row bg-[color:var(--background-color)] px-1 border drop-shadow-md shadow-gray-500">
					<FormatButton icon={faBold} styleChange="bold" />
					<FormatButton icon={faItalic} styleChange="italic" />
					<FormatButton icon={faEye} styleChange="invisible" />
				</div>
			)}
		</div>
	);
};

export default RichTextToolBar;
