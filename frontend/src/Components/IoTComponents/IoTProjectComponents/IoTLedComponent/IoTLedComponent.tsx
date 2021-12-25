import { IoTLedComponentProps } from './IoTLedComponentTypes';
import { LED_STATE } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTLed';
import ledOnImg from '../../../../assets/images/iot/LED_ON.jpg';
import ledOffImg from '../../../../assets/images/iot/LED_OFF.png';

const IoTLedComponent = ({ component }: IoTLedComponentProps) => {
	return (
		<>
			<img
				alt=""
				width={100}
				height={100}
				src={component.value === LED_STATE.ON ? ledOnImg : ledOffImg}
			></img>
		</>
	);
};

export default IoTLedComponent;