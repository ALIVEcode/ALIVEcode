import { useState } from 'react';
import Modal from '../../../UtilsComponents/Modal/Modal';
import IoTObjectSettings from '../IoTObjectSettings/IoTObjectSettings';
import Card from '../../../UtilsComponents/Cards/Card/Card';
import IoTIcon from '../../../../assets/images/icons/iot-icon.png';
import { IoTObjectLargeCardProps } from './iotObjectLargeCardeTypes';

const IoTObjectLargeCard = ({
	object,
	onUpdate,
	onDelete,
}: IoTObjectLargeCardProps) => {
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
				setOpen={setSettingsOpen}
				hideFooter
				closeCross
			>
				<IoTObjectSettings
					onUpdate={obj => {
						setSettingsOpen(false);
						onUpdate(obj);
					}}
					onDelete={obj => {
						setSettingsOpen(false);
						onDelete && onDelete(obj);
					}}
					object={object}
				/>
			</Modal>
		</>
	);
};

export default IoTObjectLargeCard;
