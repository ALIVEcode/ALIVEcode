import { createContext } from 'react';
import { Classroom } from '../../Models/Classroom/classroom.entity';
import { Course } from '../../Models/Course/course.entity';
import { Challenge } from '../../Models/Challenge/challenge.entity';

export type DashboardContextValues = {
	courses: Course[] | undefined;
	recentCourses: Course[] | undefined;
	classrooms: Classroom[] | undefined;
	getChallenges: () => Challenge[];
	setFormJoinClassOpen: (bool: boolean) => void;
	setOpenFormCreateCourse: (bool: boolean, classroom?: Classroom) => void;
};

export const DashboardContext = createContext<DashboardContextValues>({
	courses: [],
	recentCourses: [],
	classrooms: [],
	getChallenges: () => [],
	setFormJoinClassOpen: () => {},
	setOpenFormCreateCourse: () => {},
});
