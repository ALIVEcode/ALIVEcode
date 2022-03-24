export type SwitchCourseTabActions = {
	tab: CourseTabs;
};

export type CourseTabs = 'navigation' | 'layout';

export const SwitchCourseTabReducer = (
	state: { tab: CourseTabs },
	action: SwitchCourseTabActions,
): { tab: CourseTabs } => {
	switch (action.tab) {
		case 'navigation':
			return { tab: 'navigation' };
		case 'layout':
			return { tab: 'layout' };
		default:
			return { tab: 'navigation' };
	}
};
