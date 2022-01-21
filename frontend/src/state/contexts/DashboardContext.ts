import { createContext } from 'react';
import { Classroom } from '../../Models/Classroom/classroom.entity';
import { Course } from '../../Models/Course/course.entity';
import { Level } from '../../Models/Level/level.entity';

export type DashboardContextValues = {
	getCourses: () => Course[];
	getClassrooms: () => Classroom[];
	getLevels: () => Level[];
};

export const DashboardContext = createContext<DashboardContextValues>({
	getCourses: () => [],
	getClassrooms: () => [],
	getLevels: () => [],
});
