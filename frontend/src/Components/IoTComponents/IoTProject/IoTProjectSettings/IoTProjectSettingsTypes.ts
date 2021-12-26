import { IoTProject } from "../../../../Models/Iot/IoTproject.entity";

export type IoTProjectSettingsProps = {
	project: IoTProject;
	setProject: (project: IoTProject) => void;
	canEdit?: boolean;
};