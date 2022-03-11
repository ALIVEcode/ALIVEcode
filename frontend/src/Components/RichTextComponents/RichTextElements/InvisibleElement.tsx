const InvisibleElement = (props: {
	attributes: object;
	children: JSX.Element;
}) => {
	return (
		<span {...props.attributes} className="opacity-25">
			{props.children}
		</span>
	);
};

export default InvisibleElement;
