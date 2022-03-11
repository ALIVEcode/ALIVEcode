import { IconProp } from '@fortawesome/fontawesome-svg-core';

export type RichTextToolBarProps = {};

export type RichTextToolBarButtonFormatProps = {
	icon: IconProp;
	styleChange: string;
	hotkey?: { ctrlModifier?: boolean; key: string; preventDefault?: boolean };
	toggle?: boolean;
};
