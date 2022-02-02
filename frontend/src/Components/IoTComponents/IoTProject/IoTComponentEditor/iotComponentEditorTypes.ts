import { IoTComponent } from '../../../../Models/Iot/IoTProjectClasses/IoTComponent';

export type IoTComponentEditorProps = {
	component: IoTComponent;
	onClose: () => void;
};