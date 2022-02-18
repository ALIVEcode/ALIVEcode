import { Classroom } from '../../../Models/Classroom/classroom.entity';

export type ClassroomSettingsProps = {
	classroom: Classroom;
	onSubmit?: (data: any) => void;
};
