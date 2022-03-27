import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Descendant } from 'slate';
import { RichTextLeafType, RichTextBlockStyles } from '../RichTextElements/richTextStyleTypes';

export type RichTextEditorProps = {
	onChange: (value: Descendant[]) => void;
	defaultText?: Descendant[];
	readOnly?: boolean;
};

export type RichTextToolBarProps = {};



