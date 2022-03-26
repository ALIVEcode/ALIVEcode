import Badge from '../../../UtilsComponents/Badge/Badge';
import { IoTLabelComponentProps } from './IoTLabelComponentTypes';

const IoTLabelComponent = ({ component }: IoTLabelComponentProps) => {
	return (
		<Badge
			className="mt-2"
			style={{ fontSize: `${component.getFontSize()}px` }}
			variant="primary"
		>
			{component.displayedValue != null ? (
				component.displayedValue
			) : (
				<i className="font-bold text-red-600">ERROR</i>
			)}
		</Badge>
	);
};

export default IoTLabelComponent;
