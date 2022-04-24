import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * @author Mathis Laroche
 */
import { InfoIconProps } from './HelpProps';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { classNames } from '../../Types/utils';
import { Popup } from 'reactjs-popup';

const InfoIcon = ({
	activateOnHover = true,
	className,
	iconClassName,
	ignoreDefaultIconStyle,
	onClick,
	iconSize,
	hoverPopup,
	children,
}: InfoIconProps) => {
	return (
		<Popup
			on={activateOnHover ? 'hover' : 'click'}
			trigger={
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
						className={classNames(
							!ignoreDefaultIconStyle &&
								'p-1 align-middle [color:var(--fourth-color)] hover:text-blue-500',
							(!activateOnHover || onClick) && 'cursor-pointer',
							iconClassName,
						)}
					/>
				</div>
			}
			arrowStyle={{
				color: 'rgb(var(--foreground-color-rgb),0.7)',
			}}
			{...hoverPopup}
		>
			{children}
		</Popup>
	);
};
export default InfoIcon;
