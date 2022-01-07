import { Classroom } from "../../../Models/Classroom/classroom.entity";

export type ClassroomSectionProps = {
	classroom: Classroom;
	onClick: () => void;
	selected: boolean;
};