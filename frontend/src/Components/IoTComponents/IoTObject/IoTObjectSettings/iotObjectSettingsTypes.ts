import { IoTObject } from '../../../../Models/Iot/IoTobject.entity';

export type IoTObjectSettingsProps = {
	object: IoTObject;
	onUpdate: (iotObject: IoTObject) => void;
};