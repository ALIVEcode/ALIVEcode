import { IoTProject } from '../../../../Models/Iot/IoTproject.entity';

export type IoTProjectBodyProps = {
	project: IoTProject;
	canEdit?: boolean;
};
