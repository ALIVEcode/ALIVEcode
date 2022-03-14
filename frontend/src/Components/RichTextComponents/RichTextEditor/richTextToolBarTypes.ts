import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Descendant } from 'slate';

export type RichTextEditorProps = {
	onChange: (value: Descendant[]) => void;
	defaultText?: Descendant[];
};

export type RichTextToolBarProps = {};

export type RichTextToolBarButtonFormatProps = {
	icon: IconProp;
	styleChange: richTextStyles;
	showSeparator?: boolean;
};

export type richTextStyles = 'invisible' | 'italic' | 'bold' | 'emphasis';

export type StyleElementProps = {
	attributes: object;
	children: JSX.Element;
};
