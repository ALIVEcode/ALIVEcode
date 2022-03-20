import { IoTLedComponentProps } from './IoTTrafficLightComponentTypes';
import ledOffImg from '../../../../assets/images/iot/traffic_light_off.png';
import ledGreenImg from '../../../../assets/images/iot/traffic_light_green.png';
import ledYellowImg from '../../../../assets/images/iot/traffic_light_yellow.png';
import ledRedImg from '../../../../assets/images/iot/traffic_light_red.png';
import { TRAFFIC_LIGHT_STATE } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTTrafficLight';

const IoTTrafficLightComponent = ({ component }: IoTLedComponentProps) => {
	const getImage = () => {
		if (!component.displayedValue) return ledOffImg;
		switch (component.displayedValue.toUpperCase()) {
			case TRAFFIC_LIGHT_STATE.OFF:
				return ledOffImg;
			case TRAFFIC_LIGHT_STATE.GREEN:
				return ledGreenImg;
			case TRAFFIC_LIGHT_STATE.YELLOW:
				return ledYellowImg;
			case TRAFFIC_LIGHT_STATE.RED:
				return ledRedImg;
			default:
				return ledOffImg;
		}
	};

	return (
		<>
			<img alt="" width={100} height={100} src={getImage()}></img>
		</>
	);
};

export default IoTTrafficLightComponent;
