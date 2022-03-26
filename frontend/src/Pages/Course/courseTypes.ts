export type SwitchCourseTabActions = {
	tab?: CourseTabs;
	openedActivityId?: string | null;
};

export type CourseTabs = 'view' | 'layout';
