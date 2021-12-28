import { Badge } from 'react-bootstrap';
import { IoTLabelComponentProps } from './IoTLabelComponentTypes';

const IoTLabelComponent = ({ component }: IoTLabelComponentProps) => {
	return (
		<Badge
			className="mt-2"
			style={{ fontSize: `${component.getFontSize()}px` }}
			bg="primary"
		>
			{component.value}
		</Badge>
	);
};

export default IoTLabelComponent;