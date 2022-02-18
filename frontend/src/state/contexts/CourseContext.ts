import { createContext } from 'react';
import { Activity } from '../../Models/Course/activity.entity';
import { Course } from '../../Models/Course/course.entity';
import { Section } from '../../Models/Course/section.entity';

export declare class CourseElement {
	id: number;
	courseParent?: Course;
	sectionParent?: Section;

	activity?: Activity;
	section?: Section;
}

export type CourseContextValues = {
	course?: Course;
	section?: Section;
	activity?: Activity;
	isNavigationOpen: boolean;
	canEdit: boolean;
	setTitle: (newTitle: string) => void;
	loadActivity: (section: Section, activity: Activity) => any;
	closeCurrentActivity: () => void;
	saveActivity: (activity: Activity) => void;
	saveActivityContent: (data: string) => void;
	setIsNavigationOpen: (bool: boolean) => void;
	add: (element: Activity | Section, sectionParent?: Section) => void;
	delete: (element: Activity | Section) => void;
	move: (
		element: CourseElement,
		newIdx: number,
		newParent: CourseElement,
	) => void;
};

export const CourseContext = createContext<CourseContextValues>({
	canEdit: false,
	isNavigationOpen: true,
	setTitle: (newTitle: string) => {},
	loadActivity: (section: Section, activity: Activity) => {},
	closeCurrentActivity: () => {},
	saveActivity: (activity: Activity) => {},
	saveActivityContent: (data: string) => {},
	setIsNavigationOpen: (bool: boolean) => {},
	add: (element: Activity | Section, sectionParent?: Section) => {},
	delete: (element: Activity | Section) => {},
	move: (
		element: CourseElement,
		newIdx: number,
		newParent: CourseElement,
	) => {},
});
