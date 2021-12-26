import { IconDefinition, SizeProp } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { JsxElement } from 'typescript';
import { Dropdown } from 'react-bootstrap';
import styled from 'styled-components';
import { Popup } from 'reactjs-popup';

export type TDOptionProps = {
	children: JSX.Element | JSX.Element[];
	hideBackground?: boolean;
	color: string;
	size: SizeProp;
};

export interface OptionProps {
	name: string;
	icon: IconDefinition;
	onClick: () => void;
	hoverColor?: string;
	toolTipText?: string;
}

export const StyledPopup = styled.div`
	.menu-item {
		display: grid;
		cursor: pointer;
		padding: 5px;
	}
	.menu-item:hover {
		color: ${({ hoverColor }: { hoverColor: string }) => hoverColor};

		border: 1px dotted rgb(187, 187, 187);
		border-radius: 10px;
	}
	.TDoption-option:hover {
		color: var(--contrast-color);
	}
`;
