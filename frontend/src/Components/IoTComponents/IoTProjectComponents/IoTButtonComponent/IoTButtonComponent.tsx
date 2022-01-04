import Button from '../../../UtilsComponents/Button/Button';
import { IoTButtonComponentProps } from './IoTButtonComponentTypes';

const IoTButtonComponent = ({ component }: IoTButtonComponentProps) => {
	return (
		<Button onClick={() => component.onClick()} variant="third">
			{component.value}
		</Button>
	);
};

export default IoTButtonComponent;
