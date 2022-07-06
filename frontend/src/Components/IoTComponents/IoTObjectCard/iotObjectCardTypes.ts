import { IoTObject } from '../../../Models/Iot/IoTobject.entity';

export type IoTObjectCardProps = {
	object: IoTObject;
	handleObjectDeletion: (object: IoTObject) => void;
	handleObjectUpdate: (object: IoTObject, newName: string) => void;
	handleLogsOpening: (object: IoTObject) => void;
};
