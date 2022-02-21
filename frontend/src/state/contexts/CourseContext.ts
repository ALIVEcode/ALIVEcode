import { createContext } from 'react';
import { Activity } from '../../Models/Course/activity.entity';
import { Course } from '../../Models/Course/course.entity';
import {
	CourseContent,
	CourseElement,
} from '../../Models/Course/course_element.entity';
import { Section } from '../../Models/Course/section.entity';

export type CourseContextValues = {
	course?: Course;
	section?: Section;
	activity?: Activity;
	courseElements?: { [id: number]: CourseElement };
	isNavigationOpen: boolean;
	canEdit: boolean;
	setTitle: (newTitle: string) => void;
	loadActivity: (section: Section, activity: Activity) => any;
	closeCurrentActivity: () => void;
	saveActivity: (activity: Activity) => void;
	saveActivityContent: (data: string) => void;
	setIsNavigationOpen: (bool: boolean) => void;
	addContent: (content: CourseContent, sectionParent?: Section) => void;
	deleteElement: (element: CourseElement) => void;
	moveElement: (
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
	addContent: (content: CourseContent, sectionParent?: Section) => {},
	deleteElement: (element: CourseElement) => {},
	moveElement: (
		element: CourseElement,
		newIdx: number,
		newParent: CourseElement,
	) => {},
});
