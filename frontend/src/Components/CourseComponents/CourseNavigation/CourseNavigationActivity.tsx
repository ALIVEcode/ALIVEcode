import { Activity } from '../../../Models/Course/activity.entity';
import { CourseNavigationActivityProps } from './courseNavigationTypes';

const CourseNavigationActivity = ({
	element,
}: CourseNavigationActivityProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const activity = element.activity as Activity;
	return (
		<div className="p-3 border-t border-l border-b border-[color:var(--bg-shade-four-color)]">
			<span>{element.name}</span>
		</div>
	);
};

export default CourseNavigationActivity;
