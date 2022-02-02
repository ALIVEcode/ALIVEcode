import { IoTProject } from "../../../../Models/Iot/IoTproject.entity";

export type IoTProjectAccessProps = {
	project: IoTProject;
	setProject: (project: IoTProject) => void;
};