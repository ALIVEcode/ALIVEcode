import { EditorTabProps, StyledEditorTabProps } from './editorTabTypes';
import styled from 'styled-components';

const StyledSvg = styled.svg`
	padding-top: 8px;
	fill: ${({ open }: StyledEditorTabProps) =>
		open ? 'var(--secondary-color)' : 'var(--primary-color)'};
	width: 120px;
	text-align: center;
	cursor: pointer;

	&:hover {
		fill: rgba(
			${({ open }: StyledEditorTabProps) =>
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
 * EditorTab for the line interface
 *
 * @param {EditorTabModel} tab tab object
 * @param {(bool: boolean) => void} setOpen callback function that update the parent state
 * @param {() => void} onClick callback function called when the tab is clicked
 * @param {() => void} onOpen callback called when the tab gets opened
 * @param {() => void} onClose callback called when the tab gets closed
 *
 * @author MoSk3
 */
const EditorTab = ({
	tab,
	setOpen,
	onClick,
	onOpen,
	onClose,
}: EditorTabProps) => {
	return (
		<StyledSvg
			open={tab.open}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 100 30"
			preserveAspectRatio="none"
			onClick={() => {
				if (tab.open && onClose) onClose();
				if (!tab.open && onOpen) onOpen();
				onClick && onClick();
				setOpen(!tab.open);
			}}
		>
			<polygon points="7 0 93 0 100 30 0 30" />
			<text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
				{tab.title}
			</text>
		</StyledSvg>
	);
};

export default EditorTab;