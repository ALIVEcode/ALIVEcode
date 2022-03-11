import { Activity } from '../../../Models/Course/activity.entity';
import { CourseLayoutActivityProps } from './courseLayoutTypes';

/**
 * Useless compoenent to show an activity (currently empty)
 *
 * @param courseElement
 *
 * @author Mathis Laroche
 */
const CourseLayoutActivity = ({ courseElement }: CourseLayoutActivityProps) => {
	const activity = courseElement.activity as Activity;
	return <></>;
};

export default CourseLayoutActivity;
