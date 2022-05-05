import { useMemo } from 'react';
import { createDefaultIoTProgressBar } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTProgressBar';
import { createDefaultIoTLogs } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTLogs';
import { createDefaultIoTButton } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTButton';
import IoTGenericComponent from '../../IoTProjectComponents/IoTGenericComponent/IoTGenericComponent';
import { createDefaultIoTLed } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTLed';
import {
	StyledIoTComponentCreator,
	IoTComponentCreatorProps,
} from './iotComponentCreatorTypes';
import { createDefaultIoTLabel } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTLabel';
import { createDefaultIoTBuzzer } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTBuzzer';
import { createDefaultTrafficLight } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTTrafficLight';
import { useTranslation } from 'react-i18next';

export const IoTComponentCreator = ({ onSelect }: IoTComponentCreatorProps) => {
	const { t } = useTranslation();
	const components = useMemo(
		() => [
			createDefaultIoTProgressBar(t),
			createDefaultIoTButton(t),
			createDefaultIoTLogs(t),
			createDefaultIoTLed(t),
			createDefaultIoTLabel(t),
			createDefaultIoTBuzzer(t),
			createDefaultTrafficLight(t),
		],
		[t],
	);

	return (
		<StyledIoTComponentCreator>
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
				{components.map((c, idx) => (
					<IoTGenericComponent
						key={idx}
						selectable
						onSelect={() => onSelect(c)}
						component={c}
					/>
				))}
			</div>
		</StyledIoTComponentCreator>
	);
};

export default IoTComponentCreator;
