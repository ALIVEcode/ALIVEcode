import { IconProp } from '@fortawesome/fontawesome-svg-core';
import styled from 'styled-components';

export type ButtonVariants = 'primary' | 'secondary' | 'third' | 'danger';

export type StyledButtonProps = {
	padding?: string;
	disabled?: boolean;
	variant?: ButtonVariants;
};

export type ButtonProps = {
	to?: string;
	variant: ButtonVariants;
	icon?: IconProp;
};

export const StyledButton = styled.button`
	${({ variant }: StyledButtonProps) => {
		switch (variant) {
			case 'primary':
				return 'background-color: var(--third-color) !important;';
			case 'secondary':
				return 'background-color: var(--secondary-color) !important;';
			case 'danger':
				return 'background-color: rgb(207, 0, 0) !important;';
		}
	}}
	border-style: none;
	color: white;
	padding: ${({ padding }: StyledButtonProps) => padding ?? 'none'};

	&:hover {
		color: white;
		${({ disabled }: StyledButtonProps) =>
			!disabled && 'background-color: var(--contrast-color) !important;'}
	}
`;
