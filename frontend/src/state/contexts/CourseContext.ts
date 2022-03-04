import { createContext, MutableRefObject } from 'react';
import { Activity } from '../../Models/Course/activity.entity';
import { Course } from '../../Models/Course/course.entity';
import {
	CourseContent,
	CourseElement,
} from '../../Models/Course/course_element.entity';
import { Section } from '../../Models/Course/section.entity';
import {
	CourseTabs,
	SwitchCourseTabActions,
} from '../../Pages/Course/courseTypes';

export type CourseContextValues = {
	course?: Course;
	section?: MutableRefObject<Section | undefined>;
	activity?: MutableRefObject<Activity | undefined>;
	courseElements?: MutableRefObject<{ [id: number]: CourseElement }>;
	isNavigationOpen: boolean;
	canEdit: boolean;
	tabSelected: { tab: CourseTabs };
	setTabSelected: React.Dispatch<SwitchCourseTabActions>;
	setTitle: (newTitle: string) => Promise<void>;
	openedActivity?: Activity;
	openActivity: (activity: Activity) => Promise<any>;
	closeOpenedActivity: () => any;
	loadSectionElements: (section: Section) => Promise<any>;
	renameElement: (element: CourseElement, newName: string) => void;
	saveActivity: (activity: Activity) => Promise<void>;
	saveActivityContent: (data: string) => Promise<void>;
	setIsNavigationOpen: (bool: boolean) => void;
	addContent: (
		content: CourseContent,
		name: string,
		sectionParent?: Section,
	) => Promise<void>;
	deleteElement: (element: CourseElement) => Promise<void>;
	moveElement: (
		element: CourseElement,
		newIdx: number,
		newParent: CourseElement,
	) => Promise<void>;
	openSectionForm: (sectionParent?: Section) => void;
	openActivityForm: (sectionParent?: Section) => void;
};

export const CourseContext = createContext<CourseContextValues>({
	canEdit: false,
	isNavigationOpen: true,
	tabSelected: { tab: 'navigation' },
	setTabSelected: (..._) => {},
	setTitle: async (newTitle: string) => {},
	openActivity: async (..._) => {},
	closeOpenedActivity: () => {},
	saveActivity: async (activity: Activity) => {},
	saveActivityContent: async (data: string) => {},
	setIsNavigationOpen: async (bool: boolean) => {},
	addContent: async (
		content: CourseContent,
		name: string,
		sectionParent?: Section,
	) => {},
	renameElement: (element: CourseElement, newName: string) => {},
	deleteElement: async (element: CourseElement) => {},
	moveElement: async (
		element: CourseElement,
		newIdx: number,
		newParent: CourseElement,
	) => {},
	loadSectionElements: async (section: Section) => {},
	openSectionForm: () => {},
	openActivityForm: () => {},
});
