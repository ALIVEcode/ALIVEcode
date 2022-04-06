import { AsScript } from '../../../../Models/AsScript/as-script.entity';
import { IoTProjectObject } from '../../../../Models/Iot/IoTprojectObject.entity';

export type IoTScriptProps = {
	script: AsScript;
	odd?: boolean;
	mode?: 'script-linking';
	objectToLink?: IoTProjectObject;
};
