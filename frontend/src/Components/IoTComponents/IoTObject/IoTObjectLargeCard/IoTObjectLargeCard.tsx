import { useState } from 'react';
import Modal from '../../../UtilsComponents/Modal/Modal';
import IoTObjectSettings from '../IoTObjectSettings/IoTObjectSettings';
import Card from '../../../UtilsComponents/Cards/Card/Card';
import IoTIcon from '../../../../assets/images/icons/iot-icon.png';
import { IoTObjectLargeCardProps } from './iotObjectLargeCardeTypes';

const IoTObjectLargeCard = ({ object, onUpdate }: IoTObjectLargeCardProps) => {
	const [settingsOpen, setSettingsOpen] = useState(false);

	return (
		<>
			<Card
				title={object.name}
				onClick={() => setSettingsOpen(true)}
				img={IoTIcon}
			/>
			<Modal
				title="Object settings"
				open={settingsOpen}
				onClose={() => setSettingsOpen(false)}
			>
				<IoTObjectSettings
					onUpdate={obj => {
						setSettingsOpen(false);
						onUpdate(obj);
					}}
					object={object}
				></IoTObjectSettings>
			</Modal>
		</>
	);
};

export default IoTObjectLargeCard;