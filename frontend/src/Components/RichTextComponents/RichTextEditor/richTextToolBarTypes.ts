import { IconProp } from '@fortawesome/fontawesome-svg-core';

export type RichTextToolBarProps = {
};

export type RichTextToolBarButtonFormatProps = {
	icon: IconProp;
	styleChange: richTextStyles;
	showSeparator?: boolean;
};

export type richTextStyles = 'invisible' | 'italic' | 'bold';

export type StyleElementProps = {
	attributes: object;
	children: JSX.Element;
};
