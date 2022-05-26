import styled from 'styled-components';
import { EditorTabModel } from '../LineInterface/lineInterfaceTypes';
import { AITabProps, StyledAITabProps } from './AITabTypes';

/**
 * This constant contains the CSS code related to the AITab component.
 */
const AIStyledSvg = styled.svg`
	padding-top: 0px;
	fill: ${({ open }: StyledAITabProps) =>
		open ? 'var(--secondary-color)' : 'var(--bg-shade-one-color)'};
	width: 120px;
	text-align: center;
	border-width: 1px;
	border-color: var(--bg-shade-two-color);
	cursor: pointer;

	&:hover {
		fill: rgba(
			${({ open }: StyledAITabProps) =>
				open ? 'var(--secondary-color-rgb)' : 'var(--primary-color-rgb)'},
			0.55
		);
	}

	text {
		fill: var(--foreground-color);
		text-align: center;
		font-size: 0.8em;
	}
`;

/**
 * This component represents a tab in the AI interface. There are 4 of them in
 * the interface.
 *
 * @param {EditorTabModel} tab tab object containing information such as the title.
 * @param {(bool: boolean) => void} setOpen callback function that updates the parent state.
 * @param {() => void} onClick callback function called when the tab is clicked.
 * @param {() => void} onOpen callback called when the tab is being opened.
 * @param {() => void} onClose callback called when the tab is being closed.
 *
 * @author Enric Soldevila, Félix Jobin
 */
const AITab = ({ tab, setOpen, onClick, onOpen, onClose }: AITabProps) => {
	return (
		<AIStyledSvg
			open={tab.open}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 130 40"
			preserveAspectRatio="none"
			onClick={() => {
				if (tab.open && onClose) onClose();
				if (!tab.open && onOpen) onOpen();
				onClick && onClick();
				setOpen(!tab.open);
			}}
		>
			<polygon points="0 0 130 0 130 40 0 40 0" />
			<text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
				{tab.title}
			</text>
		</AIStyledSvg>
	);
};

export default AITab;
