import { createContext } from 'react';
import {
	IoTProject,
	IoTProjectDocument,
	IOTPROJECT_ACCESS,
	IOTPROJECT_INTERACT_RIGHTS,
} from '../../Models/Iot/IoTproject.entity';
import { IotRoute } from '../../Models/Iot/IoTroute.entity';
import { AsScript } from '../../Models/AsScript/as-script.entity';
import { IoTSocket } from '../../Models/Iot/IoTProjectClasses/IoTSocket';
import { IoTProjectObject } from '../../Models/Iot/IoTprojectObject.entity';
import { IoTObject } from '../../Models/Iot/IoTobject.entity';

export type IoTProjectContextValues = {
	project: IoTProject | null;
	canEdit: boolean;
	updateId: string;
	isChallenge: boolean;
	socket: IoTSocket | null;
	objectsRunning: IoTProjectObject[];
	addRunningObject: (obj: IoTProjectObject) => void;
	removeRunningObject: (obj: IoTProjectObject) => void;
	addRoute: (route: IotRoute) => void;
	deleteRoute: (route: IotRoute) => void;
	updateRoute: (route: IotRoute) => void;
	addIoTObject: (iotProjectObject: IoTProjectObject) => void;
	loadIoTObjects: () => void;
	loadIoTScripts: () => Promise<void>;
	updateProjectData: (
		name: string,
		desc: string,
		access: IOTPROJECT_ACCESS,
		interactRights: IOTPROJECT_INTERACT_RIGHTS,
	) => void;
	updateScript: (route: IotRoute, asScript: AsScript) => void;
	updateDocument: (doc: IoTProjectDocument) => void;
	connectObjectToProject: (iotObject: IoTObject) => Promise<void>;
	disconnectObjectFromProject: (iotObject: IoTObject) => Promise<void>;
	createScript: (asScript: AsScript) => Promise<void>;
	setScriptOpen: (asScript: AsScript | undefined) => void;
	setLogsOpen: (object: IoTObject | undefined) => void;
	setScriptOfObject: (
		projectObject: IoTProjectObject,
		script: AsScript,
	) => Promise<void>;
};

export const IoTProjectContext = createContext<IoTProjectContextValues>({
	canEdit: false,
	project: null,
	updateId: '',
	isChallenge: false,
	socket: null,
	objectsRunning: [],
	addRoute: () => {},
	deleteRoute: () => {},
	updateRoute: () => {},
	addIoTObject: () => {},
	loadIoTObjects: () => {},
	loadIoTScripts: async () => {},
	updateProjectData: () => {},
	updateScript: () => {},
	updateDocument: () => {},
	connectObjectToProject: async () => {},
	disconnectObjectFromProject: async () => {},
	createScript: async () => {},
	setScriptOpen: () => {},
	setLogsOpen: () => {},
	setScriptOfObject: async () => {},
	removeRunningObject: () => {},
	addRunningObject: () => {},
});
