import { TypeCardProps } from './typeCardTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import { ThemeContext } from '../../../../state/contexts/ThemeContext';
import { classNames } from '../../../../Types/utils';
import useView from '../../../../state/hooks/useView';

/**
 * Card component used to choose between different subjects or types
 * of activites.
 * @param title Title of the card
 * @param onClick Function called when clicking the Card
 * @param alt (Optional) Alt text of the image
 * @param img (Optional) image of the card
 * @param icon (Optional) icon of the card if no image
 * @param color (Optional) color of the icon
 * @param tooltip (Optional) tool tip to display in top right of the card
 * @returns
 */
const TypeCard = (props: TypeCardProps) => {
	const { theme } = useContext(ThemeContext);
	const view = useView();

	return (
		<div
			className={classNames(
				'bg-[color:var(--background-color)] border border-[color:var(--bg-shade-four-color)] aspect-square flex flex-col items-center justify-center gap-8 cursor-pointer rounded-md transition-colors duration-100',
				props.selected && 'border-2 border-[color:var(--logo-color)]',
			)}
			onClick={props.onClick}
		>
			{props.img && <img src={props.img} alt={props.alt} />}
			{props.icon && (
				<div>
					<FontAwesomeIcon
						color={props.color ?? theme.color.fg_shade_one}
						size={view.screenType === 'laptop' ? '4x' : '7x'}
						icon={props.icon}
					/>
				</div>
			)}
			<div className="text-lg text-center">{props.title}</div>
		</div>
	);
};

export default TypeCard;
