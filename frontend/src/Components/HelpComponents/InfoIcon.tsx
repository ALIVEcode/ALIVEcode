import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * @author Mathis Laroche
 */
import { InfoIconProps } from './HelpProps';
import { classNames } from '../../Types/utils';
import { Popup } from 'reactjs-popup';
import { useTranslation } from 'react-i18next';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const InfoIcon = ({
	activateOnHover = true,
	className,
	iconClassName,
	ignoreDefaultIconStyle,
	onClick,
	iconSize,
	hoverPopup,
	children,
	tooltip,
	noTooltip,
}: InfoIconProps) => {
	const { t } = useTranslation();

	const Icon = () => {
		return (
			<div
				className={classNames(
					'px-1 flex justify-center w-fit h-fit',
					className,
				)}
			>
				<FontAwesomeIcon
					icon={faInfoCircle}
					onClick={onClick}
					size={iconSize ?? '2x'}
					title={
						!noTooltip
							? tooltip === undefined
								? t('help.click_for_more')
								: tooltip
							: undefined
					}
					className={classNames(
						!ignoreDefaultIconStyle &&
							'p-1 align-middle [color:var(--fourth-color)] hover:text-blue-500',
						(!activateOnHover || onClick) && 'cursor-pointer',
						iconClassName,
					)}
				/>
			</div>
		);
	};

	return children ? (
		<Popup
			on={activateOnHover ? 'hover' : 'click'}
			trigger={Icon()}
			arrowStyle={{
				color: 'rgb(var(--foreground-color-rgb),0.7)',
			}}
			{...hoverPopup}
		>
			{children}
		</Popup>
	) : (
		<Icon />
	);
};
export default InfoIcon;
