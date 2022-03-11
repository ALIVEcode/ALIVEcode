import { Descendant, Editor, Range, Transforms } from 'slate';
import { useEffect, useRef } from 'react';
import { useFocused, useSlate } from 'slate-react';
import { RichTextToolBarButtonFormatProps } from './richTextToolBarTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold } from '@fortawesome/free-solid-svg-icons';

const RichTextToolBar = () => {
	const ref = useRef<HTMLDivElement | null>();
	const editor = useSlate();
	const inFocus = useFocused();

	const FormatButton = ({
		icon,
		styleChange,
		hotkey,
		toggle = true,
	}: RichTextToolBarButtonFormatProps) => {
		const onClick = () => {
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

		const handleHotKey = (event: KeyboardEvent) => {
			if (!hotkey) return;
			hotkey.preventDefault || event.preventDefault();
			onClick();
		};

		return (
			<FontAwesomeIcon
				onMouseDown={e => e.preventDefault()}
				icon={icon}
				onClick={onClick}
			/>
		);
	};

	return (
		<div
			className={`${editor.selection && inFocus ? 'visible' : 'invisible'}`}
			ref={ref as any}
		>
			<FormatButton icon={faBold} styleChange={'invisible'} />
		</div>
	);
};

export default RichTextToolBar;
