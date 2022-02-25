import Button from '../../../UtilsComponents/Buttons/Button';
import { IoTButtonComponentProps } from './IoTButtonComponentTypes';

const IoTButtonComponent = ({ component }: IoTButtonComponentProps) => {
	return (
		<Button onClick={() => component.onClick()} variant="third">
			{component.displayedValue != null ? (
				component.displayedValue
			) : (
				<i className="font-bold text-red-600">ERROR</i>
			)}
		</Button>
	);
};

export default IoTButtonComponent;
