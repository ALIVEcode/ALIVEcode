import { Editor, Transforms } from 'slate';
import { richTextStyles, StyleElementProps } from '../RichTextEditor/richTextToolBarTypes';


export const InvisibleElement = (props: StyleElementProps) => {
	return (
		<span {...props.attributes} className="opacity-25">
			{props.children}
		</span>
	);
};

export const ItalicElement = (props: StyleElementProps) => {
	return (
		<span {...props.attributes}>
			<i>{props.children}</i>
		</span>
	);
};

export const BoldElement = (props: StyleElementProps) => {
	return (
		<span {...props.attributes}>
			<b>{props.children}</b>
		</span>
	);
};

export const DefaultElement = (props: StyleElementProps) => {
	return <span {...props.attributes}>{props.children}</span>;
};




