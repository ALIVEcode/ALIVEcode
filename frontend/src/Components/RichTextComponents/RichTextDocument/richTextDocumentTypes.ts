import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Descendant } from 'slate';

export type RichTextDocumentProps = {
	onChange: (value: Descendant[]) => void;
	defaultText?: Descendant[];
	readOnly?: boolean;
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
