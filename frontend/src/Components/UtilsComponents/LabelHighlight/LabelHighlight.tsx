import { LabelHighlightProps, StyledLabelHighlightProps } from './LabelHighlightTypes';
import styled from 'styled-components';

const StyledDiv = styled.div`
	color: ${({ textColor }: StyledLabelHighlightProps) =>
		textColor || 'inherit'};
	background-color: ${({ color }: StyledLabelHighlightProps) =>
		color || 'var(--secondary-color)'};
	padding: ${({ padding }: StyledLabelHighlightProps) => padding || '10px'};
	border-radius: ${({ borderRadius }: StyledLabelHighlightProps) =>
		borderRadius || '10px'};
	font-size: ${({ fontSize }: StyledLabelHighlightProps) =>
		fontSize || 'inherit'};
`;

/**
 * Component that highlights some text with a colored and rounded background (example: used in dashboard)
 *
 * @param {string} text
 * @param {string} color css background color
 * @param {string} textColor css font color
 * @param {string} padding css padding
 * @param {string} borderRadius css borderRadius
 * @param {string} fontSize css fontSize
 * @param {children} children react children
 *
 * @author MoSk3
 */
const LabelHighlight = (props: LabelHighlightProps) => {
	return (
		<StyledDiv {...props}>
			{props.text ? <>{props.text}</> : <>{props.children}</>}
		</StyledDiv>
	);
};

export default LabelHighlight;