import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { useLayoutEffect, useRef } from 'react';

interface LevelButtonProps extends FontAwesomeIconProps {
	bgColor?: string;
	hoverBg?: string;
	left?: string;
	onClick?: () => void;
}

interface StyledProps {
	bgColor?: string;
	hoverBg?: string;
	left?: string;
}

const StyledButton = styled.div`
	padding: 20px;
	border: 2px;
	border-radius: 50%;
	background-color: ${({ bgColor }: StyledProps) =>
		bgColor ?? 'var(--secondary-color)'};
	text-align: center;
	transition: 0.2s;

	&:hover {
		background-color: ${({ hoverBg }: StyledProps) =>
			hoverBg ?? 'var(--contrast-color)'};
	}

	.icon {
		position: relative;
		left: ${({ left }: StyledProps) => left ?? ''};
	}
`;

/**
 * Styled LevelButton
 *
 * @param {string} bgColor css background color
 * @param {string} hoverBg css background color on hover
 * @param {string} left css left spacing
 * @param {() => void} onClick callback called when button is clicked
 *
 * @author MoSk3
 */
const LevelButton = (props: LevelButtonProps) => {
	const ref = useRef<HTMLDivElement>(null);
	const { left, bgColor, hoverBg, onClick, ...others } = props;

	const resize = () => {
		if (!ref.current) return;
		ref.current.style.width = ref.current.clientHeight + 'px';
	};

	useLayoutEffect(() => {
		document.addEventListener('resize', resize);
		resize();

		return () => {
			document.removeEventListener('resize', resize);
		};
	}, []);

	return (
		<StyledButton
			onClick={onClick}
			className="level-button"
			left={left}
			bgColor={bgColor}
			ref={ref}
		>
			<FontAwesomeIcon className="icon" {...others}></FontAwesomeIcon>
		</StyledButton>
	);
};

export default LevelButton;