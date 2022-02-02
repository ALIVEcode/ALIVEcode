import styled from 'styled-components';
import { useLayoutEffect, useRef } from 'react';
import { FillContainerProps } from './fillContainerTypes';

const StyledContainer = styled.div`
	width: 100%;
	height: 100%;
	position: absolute;
`;

/**
 * Container that auto adapts to a div or the whole page to fill it up
 *
 * @param {boolean} centered if the content should be centered
 * @param {boolean} startAtTop if the component ignores the navbar and start at the top of the window
 * @param {boolean} relative if the component should be relative
 * @param {string} id id of the component
 * @param {string} className react classNames of the component
 * @param {any} style react styling
 *
 * @author MoSk3
 */
const FillContainer = ({
	centered,
	startAtTop,
	children,
	style,
	className,
	relative,
	id,
}: FillContainerProps) => {
	const styledContainerRef = useRef<any>(null);

	const finalStyles = {
		...style,
		...(centered
			? {
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
			  }
			: {}),
		...(startAtTop
			? {
					top: '0',
			  }
			: {}),
		...(relative ? { position: 'relative' } : {}),
	};

	useLayoutEffect(() => {
		const resizeDiv = () => {
			if (styledContainerRef !== null && styledContainerRef.current !== null) {
				if (relative) {
					styledContainerRef.current.style.height =
						styledContainerRef.current.parentNode.closest('div').clientHeight +
						'px';
				} else {
					if (startAtTop) {
						styledContainerRef.current.style.height = window.innerHeight + 'px';
					} else {
						const navbar = document.getElementById('navbar');
						if (navbar)
							styledContainerRef.current.style.height =
								window.innerHeight - navbar.clientHeight - 2 + 'px';
					}
				}
			}
		};

		window.addEventListener('resize', resizeDiv);
		resizeDiv();
		setTimeout(resizeDiv, 50);

		return () => {
			window.removeEventListener('resize', resizeDiv);
		};
	});

	return (
		<StyledContainer
			id={id}
			className={className}
			style={finalStyles}
			ref={styledContainerRef}
		>
			{children}
		</StyledContainer>
	);
};

export default FillContainer;