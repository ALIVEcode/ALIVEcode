import { IoTObjectCardProps, StyledIoTObjectCard } from './iotObjectTypes';

export const IoTObjectCard = ({ object }: IoTObjectCardProps) => {
	return (
		<StyledIoTObjectCard>
			<div>{object.name}</div>
			<p>{object.description}</p>
		</StyledIoTObjectCard>
	);
};