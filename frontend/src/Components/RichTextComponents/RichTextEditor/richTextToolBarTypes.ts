import { Descendant } from 'slate';

export type RichTextEditorProps = React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLDivElement>,
	HTMLDivElement
> & {
	onEditorChange?: (value: Descendant[]) => void;
	onEditorBlur?: (value: Descendant[]) => void;
	defaultText?: Descendant[];
	readOnly?: boolean;
};

export type RichTextToolBarProps = {};
