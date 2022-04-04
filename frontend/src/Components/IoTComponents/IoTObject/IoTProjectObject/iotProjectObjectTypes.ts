import { AsScript } from '../../../../Models/AsScript/as-script.entity';
import { IoTProjectObject } from '../../../../Models/Iot/IoTprojectObject.entity';

export type IoTProjectObjectProps = {
	object: IoTProjectObject;
	odd?: boolean;
	mode?: 'script-linking' | 'default';
	scriptToLink?: AsScript;
};
