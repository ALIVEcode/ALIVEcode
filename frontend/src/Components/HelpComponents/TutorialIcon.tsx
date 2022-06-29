import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * @author Mathis Laroche
 */
import { TutorialIconProps } from './HelpProps';
import { classNames } from '../../Types/utils';
import { useTranslation } from 'react-i18next';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

const TutorialIcon = ({
	className,
	iconClassName,
	ignoreDefaultIconStyle,
	onClick,
	iconSize,
	tooltip,
	noTooltip,
}: TutorialIconProps) => {
	const { t } = useTranslation();

	return (
		<div
			className={classNames('px-1 flex justify-center w-fit h-fit', className)}
		>
			<FontAwesomeIcon
				icon={faCircle}
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
					'p-1 align-middle [color:var(--fourth-color)] hover:text-blue-500 cursor-pointer',
					iconClassName,
				)}
			/>
		</div>
	);
};


export default TutorialIcon;
