import styled from 'styled-components';

export type ButtonVariants = 'primary' | 'secondary' | 'danger';

export type StyledButtonProps = {
	padding?: string;
	disabled?: boolean;
};

export type ButtonProps = {
	to?: string;
	className?: string;
	variant: ButtonVariants;
	type?: 'button' | 'submit' | 'reset';
	onClick?: () => void;
	children?: React.ReactNode;
	padding?: string;
	disabled?: boolean;
};

export const StyledPrimaryButton = styled.button`
	background-color: var(--third-color) !important;
	border-style: none;
	color: white;
	padding: ${({ padding }: StyledButtonProps) => padding ?? 'none'};

	&:hover {
		color: white;
		${({ disabled }: StyledButtonProps) =>
			!disabled && 'background-color: var(--contrast-color) !important;'}
	}
`;

export const StyledDangerButton = styled.button`
	background-color: rgb(207, 0, 0) !important;
	border-style: none;
	color: white;
	padding: ${({ padding }: StyledButtonProps) => padding ?? 'none'};

	&:hover {
		color: white;
		${({ disabled }: StyledButtonProps) =>
			!disabled && 'background-color: var(--contrast-color) !important;'}
	}
`;

export const StyledSecondaryButton = styled.button`
	background-color: var(--secondary-color) !important;
	border-style: none;
	color: white;
	padding: ${({ padding }: StyledButtonProps) => padding ?? 'none'};

	&:hover {
		color: white;
		${({ disabled }: StyledButtonProps) =>
			!disabled && 'background-color: var(--contrast-color) !important;'}
	}
`;