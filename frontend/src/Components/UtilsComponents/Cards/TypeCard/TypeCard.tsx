import { TypeCardProps } from './typeCardTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import { ThemeContext } from '../../../../state/contexts/ThemeContext';

/**
 * Card component used to choose between different subjects or types
 * of activites.
 * @param title Title of the card
 * @param onClick Function called when clicking the Card
 * @param alt (Optional) Alt text of the image
 * @param img (Optional) image of the card
 * @param icon (Optional) icon of the card if no image
 * @returns
 */
const TypeCard = (props: TypeCardProps) => {
	const { theme } = useContext(ThemeContext);

	return (
		<div
			className="bg-[color:var(--background-color)] border border-[color:var(--bg-shade-four-color)] aspect-square flex flex-col items-center justify-center gap-8 cursor-pointer rounded-md"
			onClick={props.onClick}
		>
			{props.img && <img src={props.img} alt={props.alt} />}
			{props.icon && (
				<div>
					<FontAwesomeIcon
						color={theme.color.fg_shade_one}
						size="7x"
						icon={props.icon}
					/>
				</div>
			)}
			<div className="text-lg">{props.title}</div>
		</div>
	);
};

export default TypeCard;
