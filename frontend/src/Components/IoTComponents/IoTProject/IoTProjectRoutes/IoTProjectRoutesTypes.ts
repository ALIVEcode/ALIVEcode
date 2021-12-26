import { IoTProject } from "../../../../Models/Iot/IoTproject.entity";

export type IoTProjectRoutesProps = {
	project: IoTProject;
	setProject: (project: IoTProject) => void;
	canEdit?: boolean;
};