import { IoTLedComponentProps } from './IoTLedComponentTypes';
import ledOnImg from '../../../../assets/images/iot/LED_ON.jpg';
import ledOffImg from '../../../../assets/images/iot/LED_OFF.png';

const IoTLedComponent = ({ component }: IoTLedComponentProps) => {
	return (
		<>
			<img
				alt=""
				width={100}
				height={100}
				src={component.displayedValue ? ledOnImg : ledOffImg}
			></img>
		</>
	);
};

export default IoTLedComponent;
