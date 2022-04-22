import { InfoButtonProps } from './HelpProps';
import { Popup } from 'reactjs-popup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { classNames } from '../../Types/utils';

const InfoButton = ({
	className,
	children,
	hideDefaultStyle,
	icon,
	hoverPopup,
}: InfoButtonProps) => {
	const infoButton = () => {
		return (
			<div
				className={classNames(
					!hideDefaultStyle && 'px-1 flex justify-center w-fit h-fit',
					className,
				)}
			>
				<FontAwesomeIcon
					icon={faInfoCircle}
					onClick={icon?.onClick}
					size={icon?.size ?? '2x'}
					className={classNames(
						!icon?.hideDefaultStyle && 'p-1 align-middle',
						icon?.className,
					)}
				/>
			</div>
		);
	};

	if (hoverPopup) {
		return (
			<Popup
				on="hover"
				position={hoverPopup.position}
				trigger={infoButton()}
				arrowStyle={{
					color: 'rgb(var(--foreground-color-rgb),0.7)',
				}}
				offsetX={hoverPopup.offset?.x}
				offsetY={hoverPopup.offset?.y}
			>
				<div
					className={classNames(
						!hoverPopup.hideDefaultStyle &&
							'rounded-md bg-[color:rgb(var(--foreground-color-rgb),0.7)] p-2 ' +
								'text-[color:var(--background-color)] max-w-[30ch] text-wrap',
						hoverPopup.className,
					)}
				>
					{hoverPopup.text !== undefined && (
						<span className={hoverPopup.textClassName}>{hoverPopup.text}</span>
					)}
					{children}
				</div>
			</Popup>
		);
	}
	return infoButton();
};

export default InfoButton;
