import Button from '../../../UtilsComponents/Buttons/Button';
import { IoTButtonComponentProps } from './IoTButtonComponentTypes';

const IoTButtonComponent = ({ component }: IoTButtonComponentProps) => {
	return (
		<Button onClick={() => component.onClick()} variant="third">
			{component.displayedValue}
		</Button>
	);
};

export default IoTButtonComponent;
