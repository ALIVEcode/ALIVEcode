import GenericCard from '../GenericCard/GenericCard';
import { GenericCardProps } from '../GenericCard/genericCardTypes';

/**
 * Generic custom styled card for ALIVEcode
 *
 * @author MoSk3
 */
const Card = (props: GenericCardProps) => {
	return (
		<GenericCard
			margin="25px 50px"
			scale={1.1}
			width={300}
			height={380}
			boxShadow="0px 15px 30px rgb(131, 131, 131)"
			{...props}
		/>
	);
};

export default Card;