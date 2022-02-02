import { IoTBuzzerComponentProps } from './IoTBuzzerComponentTypes';
import buzzerImg from '../../../../assets/images/iot/buzzer.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeOff, faVolumeUp } from '@fortawesome/free-solid-svg-icons';

const IoTBuzzerComponent = ({ component }: IoTBuzzerComponentProps) => {
	return (
		<>
			<img alt="" width={100} height={100} src={buzzerImg}></img>
			<FontAwesomeIcon
				onClick={e =>
					component.isBuzzing() ? component.stopBuzz() : component.buzz()
				}
				size="lg"
				cursor="pointer"
				icon={component.isBuzzing() ? faVolumeUp : faVolumeOff}
			></FontAwesomeIcon>
		</>
	);
};

export default IoTBuzzerComponent;