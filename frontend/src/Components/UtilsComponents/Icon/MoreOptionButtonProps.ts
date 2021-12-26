import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';

export type MoreOptionsButtonProps = {
	[key in keyof Omit<FontAwesomeIconProps, 'icon'>]: FontAwesomeIconProps[key];
} & {
	onClick: () => void;
	hideBackground?: boolean;
};
