import { GenericCardProps } from '../GenericCard/genericCardTypes';
import GenericCard from '../GenericCard/GenericCard';

/**
 * Generic custom styled small card for ALIVEcode
 *
 * @author MoSk3
 */
const SmallCard = (props: GenericCardProps) => {
	return (
		<GenericCard
			margin="15px 25px"
			scale={1.05}
			width={220}
			height={300}
			boxShadow="0px 15px 30px rgb(131, 131, 131)"
			{...props}
		/>
	);
};

export default SmallCard;