import { createContext } from "react";
import { Classroom } from '../../Models/Classroom/classroom.entity';
import { Course } from '../../Models/Course/course.entity';

export type DashboardContextValues = {
	getCourses: () => Course[];
	getClassrooms: () => Classroom[];
};

export const DashboardContext = createContext<DashboardContextValues>({
	getCourses: () => [],
	getClassrooms: () => [],
});