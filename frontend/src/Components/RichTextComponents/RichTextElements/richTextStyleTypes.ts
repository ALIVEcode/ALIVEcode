import CSS from 'csstype';
import { Element } from 'slate';
import { BaseElement } from 'slate/dist/interfaces/element';
import { RenderElementProps } from 'slate-react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { MouseEventHandler } from 'react';

export type RichTextBlockStyles =
	| 'paragraph'
	| 'h1'
	| 'h2'
	| 'h3'
	| 'item_in_list'
	| 'list_bullet'
	| 'list_number'
	| 'align_left'
	| 'align_right'
	| 'align_center'
	| 'align_justify';

export type RichTextButtonProps = {
	active: boolean;
	onClick: MouseEventHandler;
	children: JSX.Element;
	showSeparator?: boolean;
};

export type RichTextMarkButtonProps = {
	icon: IconProp;
	styleChange: keyof RichTextLeafType;
	showSeparator?: boolean;
};

export type RichTextBlockButtonProps = {
	icon: IconProp;
	styleChange: RichTextBlockStyles;
	showSeparator?: boolean;
};

export type RichTextElementType = {
	type?: RichTextBlockStyles;
	align: CSS.Properties['textAlign'];
};

export type RichTextElementProps = {
	attributes: object;
	children: JSX.Element;
	element: RichTextElementType;
};

export type RichTextLeafType = {
	bold?: boolean;
	italic?: boolean;
	code?: boolean;
	underline?: boolean;
	invisible?: boolean;
	strikethrough?: boolean;
	superscript?: boolean;
	subscript?: boolean;
	backgroundColor?: CSS.Properties['color'];
	fontSize?: number;
	fontFamily?: string;
	color?: CSS.Properties['color'];
};

export type RichTextLeafProps = {
	attributes: object;
	children: JSX.Element;
	leaf: RichTextLeafType;
};
