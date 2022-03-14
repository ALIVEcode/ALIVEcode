import { StyleElementProps } from '../RichTextEditor/richTextToolBarTypes';

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

export const CenterElement = (props: StyleElementProps) => {
	return (
		<p {...props.attributes} className="text-center">
			{props.children}
		</p>
	);
};

export const JustifyElement = (props: StyleElementProps) => {
	return (
		<p {...props.attributes} className="text-left break-words">
			{props.children}
		</p>
	);
};

export const AlignLeftElement = (props: StyleElementProps) => {
	return (
		<p {...props.attributes} className="text-left">
			{props.children}
		</p>
	);
};

export const AlignRightElement = (props: StyleElementProps) => {
	return (
		<p {...props.attributes} className="text-right">
			{props.children}
		</p>
	);
};

export const DefaultElement = (props: StyleElementProps) => {
	return <span {...props.attributes}>{props.children}</span>;
};
