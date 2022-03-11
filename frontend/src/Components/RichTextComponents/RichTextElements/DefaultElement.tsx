const DefaultElement = (props: {
	attributes: object;
	children: JSX.Element;
}) => {
	return <span {...props.attributes}>{props.children}</span>;
};

export default DefaultElement;
