import styled from 'styled-components';
import { useRef } from 'react';
import {
	CenteredContainerProps,
	StyledCenteredContainerProps,
} from './centeredContainerTtypes';

const StyledContainer = styled.div`
	width: 100%;
	position: relative;
	text-align: ${(props: StyledCenteredContainerProps) =>
		props.textAlign || 'inherit'};
`;

/**
 * Component that centers all its content passed as children
 *
 * @param {boolean} vertically if it should be vertically centered
 * @param {boolean} horizontally if it should be horizontally centered
 * @param {boolean} startAtTop if the component ignores the navbar and start at the top of the window
 * @param {string} textAlign aligment of the text
 * @param {React.ReactNode} children react children to be centered inside the component
 * @param {string} className react classNames of the component
 * @param {any} style react styling
 *
 * @author MoSk3
 */
const CenteredContainer = ({
	vertically,
	horizontally,
	startAtTop,
	textAlign,
	children,
	style,
	className,
}: CenteredContainerProps) => {
	const styledContainerRef = useRef<any>(null);

	const finalStyles = {
		...style,
		...(vertically
			? {
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
			  }
			: {}),
		...(horizontally
			? {
					display: 'flex',
					textAlign: 'center',
					justifyContent: 'center',
					flexDirection: 'column',
			  }
			: {}),
		...(startAtTop
			? {
					top: '0',
			  }
			: {}),
	};

	return (
		<StyledContainer
			textAlign={textAlign}
			className={className}
			style={finalStyles}
			ref={styledContainerRef}
		>
			{children}
		</StyledContainer>
	);
};

export default CenteredContainer;