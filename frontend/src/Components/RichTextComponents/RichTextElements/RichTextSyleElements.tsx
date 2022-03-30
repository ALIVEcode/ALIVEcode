import {
	RichTextElementProps,
	RichTextLeafProps,
	RichTextLeafType,
	RichTextBlockStyles,
	RichTextBlockButtonProps,
	RichTextMarkButtonProps,
	RichTextButtonProps,
	RichTextElementType,
} from './richTextStyleTypes';
import { Editor, Element, Transforms } from 'slate';
import { MouseEventHandler } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSlate } from 'slate-react';

export const RichTextButton = ({
	onClick,
	active,
	children,
	showSeparator,
}: RichTextButtonProps) => {
	return (
		<div className="flex flex-row">
			<div
				className={`px-2 pt-0.5 pb-1 cursor-pointer ${
					!active ? 'hover:' : ''
				}bg-[color:var(--bg-shade-two-color)]`}
				onMouseDown={e => e.preventDefault()}
				onMouseUp={e => e.preventDefault()}
				onClick={onClick}
			>
				{children}
			</div>
			{/*{showSeparator && <div className="mx-1 w-1 h-4 border-r border-[color:var(--fg-shade-two-color)]" />}*/}
		</div>
	);
};

/**
 * @param icon
 * @param styleChange
 * @param getValue
 * @param mode
 * @param showSeparator
 * @constructor
 * @see https://github.com/ianstormtaylor/slate/blob/main/site/examples/richtext.tsx
 */
export const MarkButton = ({
	icon,
	styleChange,
	showSeparator = false,
}: RichTextMarkButtonProps) => {
	const editor = useSlate();
	const onClick: MouseEventHandler = event => {
		event.preventDefault();
		toggleMark(editor, styleChange);
	};

	return (
		<RichTextButton
			active={isMarkActive(editor, styleChange)}
			onClick={onClick}
			showSeparator={showSeparator}
		>
			<FontAwesomeIcon
				icon={icon}
				size="sm"
				className="[color:var(--foreground-color)]"
				title={styleChange}
			/>
		</RichTextButton>
	);
};

export const BlockButton = ({
	styleChange,
	icon,
	showSeparator,
}: RichTextBlockButtonProps) => {
	const editor = useSlate();

	const onClick: MouseEventHandler = event => {
		event.preventDefault();
		toggleBlock(editor, styleChange);
	};

	return (
		<RichTextButton
			active={isBlockActive(
				editor,
				styleChange,
				styleChange.startsWith('align_') ? 'align' : 'type',
			)}
			onClick={onClick}
			showSeparator={showSeparator}
		>
			<FontAwesomeIcon
				icon={icon}
				size="sm"
				className="[color:var(--foreground-color)]"
				title={styleChange}
			/>
		</RichTextButton>
	);
};

const RichTextElement = ({
	attributes,
	children,
	element,
}: RichTextElementProps) => {
	const style = { textAlign: element.align };

	switch (element.type) {
		case 'h1':
			return (
				<h1 style={style} className="text-3xl" {...attributes}>
					{children}
				</h1>
			);
		case 'h2':
			return (
				<h2 style={style} className="text-2xl" {...attributes}>
					{children}
				</h2>
			);
		case 'h3':
			return (
				<h3 style={style} className="text-xl" {...attributes}>
					{children}
				</h3>
			);
		case 'list_bullet':
			return (
				<ul style={style} className="list-disc" {...attributes}>
					{children}
				</ul>
			);
		case 'list_number':
			return (
				<ol style={style} className="list-decimal" {...attributes}>
					{children}
				</ol>
			);
		case 'item_in_list':
			return (
				<li style={style} className="tabular-nums" {...attributes}>
					{children}
				</li>
			);
		default:
			return (
				<p style={style} {...attributes}>
					{children}
				</p>
			);
	}
};

const RichTextLeaf = ({ attributes, children, leaf }: RichTextLeafProps) => {
	if (leaf.bold) children = <b>{children}</b>;

	if (leaf.italic) children = <em>{children}</em>;

	if (leaf.code) children = <code>{children}</code>;

	if (leaf.underline) children = <u>{children}</u>;

	if (leaf.color)
		children = <span style={{ color: leaf.color }}>{children}</span>;

	if (leaf.invisible)
		children = <span style={{ opacity: 0.75 }}>{children}</span>;

	if (leaf.strikethrough) children = <s>{children}</s>;

	if (leaf.superscript) children = <sup>{children}</sup>;

	if (leaf.subscript) children = <sub>{children}</sub>;

	if (leaf.backgroundColor)
		children = (
			<span style={{ backgroundColor: leaf.backgroundColor }}>{children}</span>
		);

	if (leaf.fontSize)
		children = <span style={{ fontSize: leaf.fontSize }}>{children}</span>;

	if (leaf.fontFamily)
		children = <span style={{ fontFamily: leaf.fontFamily }}>{children}</span>;

	return <span {...attributes}>{children}</span>;
};

export const renderElement = (props: RichTextElementProps) => (
	<RichTextElement {...props} />
);

export const renderLeaf = (props: RichTextLeafProps) => (
	<RichTextLeaf {...props} />
);

export const isMarkActive = (
	editor: Editor,
	format: keyof RichTextLeafType,
) => {
	const marks = Editor.marks(editor);
	// @ts-ignore
	return marks ? !!marks[format] : false;
};

export const toggleMark = (
	editor: Editor,
	format: keyof RichTextLeafType,
	value?: any,
) => {
	const isActive = isMarkActive(editor, format);

	if (isActive) {
		Editor.removeMark(editor, format);
	} else {
		Editor.addMark(editor, format, value ?? true);
	}
};

export const replaceMark = (
	editor: Editor,
	prevFormat: keyof RichTextLeafType,
	newFormat: keyof RichTextLeafType,
	value?: any,
) => {
	const isActive = isMarkActive(editor, prevFormat);

	if (isActive) Editor.removeMark(editor, prevFormat);

	Editor.addMark(editor, newFormat, value ?? true);
};

export const isBlockActive = (
	editor: Editor,
	format: RichTextBlockStyles,
	blockType = 'type',
) => {
	const { selection } = editor;
	if (!selection) return false;

	const [match] = Array.from(
		Editor.nodes(editor, {
			at: Editor.unhangRange(editor, selection),
			match: n =>
				// @ts-ignore
				!Editor.isEditor(n) && Element.isElement(n) && n[blockType] === format,
		}),
	);

	return !!match;
};

export const toggleBlock = (editor: Editor, format: RichTextBlockStyles) => {
	const isActive = isBlockActive(
		editor,
		format,
		format.startsWith('align_') ? 'align' : 'type',
	);
	const isList = (f: string) => f.startsWith('list_');
	const isAlign = (f: string) => f.startsWith('align_');

	Transforms.unwrapNodes(editor, {
		match: n =>
			!Editor.isEditor(n) &&
			Element.isElement(n) &&
			isList(n.type) &&
			!isAlign(format),
		split: true,
	});
	let newProperties: Partial<RichTextElementType>;
	if (isAlign(format)) {
		newProperties = {
			align: isActive ? undefined : (format.replace('align_', '') as any),
		};
	} else {
		newProperties = {
			type: isActive ? 'paragraph' : isList(format) ? 'item_in_list' : format,
		};
	}

	Transforms.setNodes<Element>(editor, newProperties);

	if (!isActive && isList(format)) {
		const block = { type: format, children: [] };
		Transforms.wrapNodes(editor, block);
	}
};
