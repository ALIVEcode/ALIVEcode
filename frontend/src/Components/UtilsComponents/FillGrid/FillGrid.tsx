import styled from 'styled-components';
import { FillGridProps } from './fillGridTypes';

const StyledContainer = styled.div`
	display: table;
	margin-top: 4rem;
	height: calc(100% - 4rem);
	width: 100%;
	box-sizing: border-box;
`;

/**
 * Container that auto adapts to a div or the whole page to fill it up
 *
 * @param {string} id id of the component
 * @param {string} className react classNames of the component
 * @param {any} style react styling
 *
 * @author Enric Soldevila
 */
const FillContainer = ({ children, className, id, style }: FillGridProps) => {
	return (
		<StyledContainer id={id} className={className} style={style}>
			{children}
		</StyledContainer>
	);
};

export default FillContainer;
