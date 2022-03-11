import { createContext } from 'react';
import { Classroom } from '../../Models/Classroom/classroom.entity';
import { Course } from '../../Models/Course/course.entity';
import { Challenge } from '../../Models/Level/challenge.entity';

export type DashboardContextValues = {
	getCourses: () => Course[];
	getClassrooms: () => Classroom[];
	getLevels: () => Challenge[];
	setFormJoinClassOpen: (bool: boolean) => void;
};

export const DashboardContext = createContext<DashboardContextValues>({
	getCourses: () => [],
	getClassrooms: () => [],
	getLevels: () => [],
	setFormJoinClassOpen: () => {},
});
