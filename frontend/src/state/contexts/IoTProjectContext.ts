import { createContext } from 'react';
import {
	IoTProject,
	IoTProjectDocument,
	IOTPROJECT_ACCESS,
	IOTPROJECT_INTERACT_RIGHTS,
} from '../../Models/Iot/IoTproject.entity';
import { IotRoute } from '../../Models/Iot/IoTroute.entity';
import { IoTObject } from '../../Models/Iot/IoTobject.entity';
import { AsScript } from '../../Models/AsScript/as-script.entity';
import { IoTSocket } from '../../Models/Iot/IoTProjectClasses/IoTSocket';

export type IoTProjectContextValues = {
	project: IoTProject | null;
	canEdit: boolean;
	updateId: string;
	isLevel: boolean;
	socket: IoTSocket | null;
	addRoute: (route: IotRoute) => void;
	deleteRoute: (route: IotRoute) => void;
	updateRoute: (route: IotRoute) => void;
	addIoTObject: (iotObject: IoTObject) => void;
	loadIoTObjects: () => void;
	updateProjectData: (
		name: string,
		desc: string,
		access: IOTPROJECT_ACCESS,
		interactRights: IOTPROJECT_INTERACT_RIGHTS,
	) => void;
	updateScript: (route: IotRoute, asScript: AsScript) => void;
	updateDocument: (doc: IoTProjectDocument) => void;
};

export const IoTProjectContext = createContext<IoTProjectContextValues>({
	canEdit: false,
	project: null,
	updateId: '',
	isLevel: false,
	socket: null,
	addRoute: () => {},
	deleteRoute: () => {},
	updateRoute: () => {},
	addIoTObject: () => {},
	loadIoTObjects: () => {},
	updateProjectData: () => {},
	updateScript: () => {},
	updateDocument: () => {},
});
