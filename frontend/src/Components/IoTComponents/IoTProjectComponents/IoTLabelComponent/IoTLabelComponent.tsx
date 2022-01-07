import Badge from '../../../UtilsComponents/Badge/Badge';
import { IoTLabelComponentProps } from './IoTLabelComponentTypes';

const IoTLabelComponent = ({ component }: IoTLabelComponentProps) => {
	return (
		<Badge
			className="mt-2"
			style={{ fontSize: `${component.getFontSize()}px` }}
			variant="primary"
		>
			{component.value}
		</Badge>
	);
};

export default IoTLabelComponent;
