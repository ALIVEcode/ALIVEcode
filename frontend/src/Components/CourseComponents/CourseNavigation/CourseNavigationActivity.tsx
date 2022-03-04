import { Activity } from '../../../Models/Course/activity.entity';
import { CourseLayoutActivityProps } from '../CourseLayout/courseLayoutTypes';

const CourseNavigationActivity = ({
	courseElement,
}: CourseLayoutActivityProps) => {
	const activity = courseElement.activity as Activity;
	return <></>;
};

export default CourseNavigationActivity;
