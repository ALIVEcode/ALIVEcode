import { IoTProject } from '../../../Models/Iot/IoTproject.entity';

export type IoTProjectCardProps = {
	project: IoTProject;
	handleProjectDeletion: (project: IoTProject) => void;
	
};
