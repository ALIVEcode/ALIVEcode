import styled from 'styled-components';
import { FillGridProps } from './fillGridTypes';

const StyledContainer = styled.div`
	display: table;
	height: 100%;
	width: 100%;
	margin-top: -50px;
	padding: 50px 0 0 0; /*set left/right padding according to needs*/
	box-sizing: border-box;
`;

/**
 * Container that auto adapts to a div or the whole page to fill it up
 *
 * @param {string} id id of the component
 * @param {string} className react classNames of the component
 * @param {any} style react styling
 *
 * @author MoSk3
 */
const FillContainer = ({ children, className, id, style }: FillGridProps) => {
	return (
		<StyledContainer id={id} className={className} style={style}>
			{children}
		</StyledContainer>
	);
};

export default FillContainer;