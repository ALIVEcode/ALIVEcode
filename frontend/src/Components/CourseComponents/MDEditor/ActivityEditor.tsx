import { useCallback, useMemo, useState } from 'react';
import { DropdownButton, Form, ListGroup } from 'react-bootstrap';
import {
	BaseEditor,
	createEditor,
	Descendant,
	Editor,
	Transforms,
	Element as SlateElement,
} from 'slate';
import { Slate, Editable, withReact, ReactEditor, useSlate } from 'slate-react';
import Button from '../../UtilsComponents/Button/Button';
import {
	Toolbar,
	Button as EditorButton,
	Icon,
} from '../ActivityContent/EditorComponents';
import { CustomElement } from './activityEditorTypes';
import {
	ActivityEditorProps,
	StyledActivityEditor,
} from './activityEditorTypes';
import isHotkey from 'is-hotkey';
import { useTranslation } from 'react-i18next';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const HOTKEYS = {
	'mod+b': 'bold',
	'mod+i': 'italic',
	'mod+u': 'underline',
	'mod+y': 'code',
	'mod+s': '',
};

const ActivityEditor = ({
	onSave,
	defaultValue,
	isEditable,
}: ActivityEditorProps) => {
	const editor = useMemo(() => withReact(createEditor()), []);

	const [value, setValue] = useState<Descendant[]>(
		defaultValue ?? [
			{
				type: 'paragraph',
				children: [{ text: 'a line of text\n\n\n' }],
			},
		],
	);
	const renderElement = useCallback(props => <Element {...props} />, []);
	const renderLeaf = useCallback(props => <Leaf {...props} />, []);
	const { t } = useTranslation();

	console.log(defaultValue);

	return (
		<StyledActivityEditor isEditable={isEditable ?? (() => false)}>
			<div className="editor-body">
				<Slate
					editor={editor}
					value={value}
					onChange={value => setValue([...value])}
				>
					{isEditable && isEditable() && (
						<Toolbar>
							<MarkButton format="bold" icon="bold" />
							<MarkButton format="italic" icon="italic" />
							<MarkButton format="underline" icon="underlined" />
							<MarkButton format="code" icon="code" />
							<BlockButton format="heading-one" icon="one" />
							<BlockButton format="heading-two" icon="two" />
							<BlockButton format="block-quote" icon="quote" />
							<DropdownButton title="listes" variant={'secondary'}>
								<BlockButton format="numbered-list" icon="liste numérotée" />
								<br />
								<BlockButton format="bulleted-list" icon="liste point" />
							</DropdownButton>
						</Toolbar>
					)}
					<Editable
						readOnly={isEditable && !isEditable()}
						placeholder={t('course.activity.empty')}
						renderElement={renderElement}
						renderLeaf={renderLeaf}
						spellCheck
						autoFocus
						onKeyDown={event => {
							if (event.key.toUpperCase() === 'S' && event.ctrlKey) {
								event.preventDefault();
								onSave && onSave(value);
							}
							for (const hotkey in HOTKEYS) {
								if (isHotkey(hotkey, event)) {
									event.preventDefault();
									const mark = HOTKEYS[hotkey as keyof typeof HOTKEYS];
									toggleMark(editor, mark);
								}
							}
						}}
					/>
				</Slate>
			</div>
		</StyledActivityEditor>
	);
};

const toggleBlock = (editor: Editor, format: string) => {
	const isActive = isBlockActive(editor, format);
	const isList = LIST_TYPES.includes(format);

	Transforms.unwrapNodes(editor, {
		match: n =>
			!Editor.isEditor(n) &&
			SlateElement.isElement(n) &&
			LIST_TYPES.includes(n.type),
		split: true,
	});
	const newProperties: Partial<SlateElement> = {
		type: isActive ? 'paragraph' : isList ? 'list-item' : format,
	};
	Transforms.setNodes<SlateElement>(editor, newProperties);

	if (!isActive && isList) {
		const block = { type: format, children: [] };
		Transforms.wrapNodes(editor, block);
	}
};

const toggleMark = (editor: Editor, format: string) => {
	const isActive = isMarkActive(editor, format);

	if (isActive) {
		Editor.removeMark(editor, format);
	} else {
		Editor.addMark(editor, format, true);
	}
};

const isBlockActive = (editor: Editor, format: string) => {
	const { selection } = editor;
	if (!selection) return false;

	const [match] = Editor.nodes(editor, {
		at: Editor.unhangRange(editor, selection),
		match: n =>
			!Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
	});

	return !!match;
};

const isMarkActive = (editor: Editor, format: string) => {
	const marks = Editor.marks(editor);
	return marks ? (marks as any)[format] === true : false;
};

const Element = ({
	attributes,
	children,
	element,
}: {
	attributes: any;
	children: any;
	element: CustomElement;
}) => {
	switch (element.type) {
		case 'block-quote':
			return <blockquote {...attributes}>{children}</blockquote>;
		case 'bulleted-list':
			return <ul {...attributes}>{children}</ul>;
		case 'heading-one':
			return <h1 {...attributes}>{children}</h1>;
		case 'heading-two':
			return <h2 {...attributes}>{children}</h2>;
		case 'list-item':
			return <li {...attributes}>{children}</li>;
		case 'numbered-list':
			return <ol {...attributes}>{children}</ol>;
		default:
			return <p {...attributes}>{children}</p>;
	}
};

const Leaf = ({
	attributes,
	children,
	leaf,
}: {
	attributes: any;
	children: any;
	leaf: any;
}) => {
	if (leaf.bold) {
		children = <strong>{children}</strong>;
	}

	if (leaf.code) {
		children = <code>{children}</code>;
	}

	if (leaf.italic) {
		children = <em>{children}</em>;
	}

	if (leaf.underline) {
		children = <u>{children}</u>;
	}

	return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, icon }: { format: string; icon: any }) => {
	const editor = useSlate();
	return (
		<EditorButton
			active={isBlockActive(editor, format)}
			onMouseDown={(event: any) => {
				event.preventDefault();
				toggleBlock(editor, format);
			}}
		>
			<Icon>{icon}</Icon>
		</EditorButton>
	);
};

const MarkButton = ({ format, icon }: { format: string; icon: any }) => {
	const editor = useSlate();
	return (
		<EditorButton
			active={isMarkActive(editor, format)}
			onMouseDown={(event: any) => {
				event.preventDefault();
				toggleMark(editor, format);
			}}
		>
			<Icon>{icon}</Icon>
		</EditorButton>
	);
};

export default ActivityEditor;