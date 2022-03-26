import { Activity } from '../../../Models/Course/activity.entity';
import { CourseNavigationActivityProps } from './courseNavigationTypes';
import { useContext } from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';
import { classNames } from '../../../Types/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Activity element appearing in the navigation menu.
 * Possibility to click on the element to open the activity
 * inside the CourseBody (To the right of the navigation)
 *
 * @author Enric Soldevila
 */
const CourseNavigationActivity = ({
	element,
}: CourseNavigationActivityProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const activity = element.activity as Activity;
	const { openActivity, closeOpenedActivity, openedActivity } =
		useContext(CourseContext);
	return (
		<div
			className={classNames(
				'p-3 pl-5 border-t border-l border-b border-[color:var(--bg-shade-four-color)] cursor-pointer transition-all duration-150',
				activity.id === openedActivity?.id
					? 'bg-[color:var(--secondary-color)] hover:bg-[color:var(--bg-shade-three-color)]'
					: 'hover:bg-[color:var(--bg-shade-one-color)]',
			)}
			onClick={() =>
				activity.id === openedActivity?.id
					? closeOpenedActivity()
					: openActivity(activity)
			}
		>
			{activity.icon && (
				<FontAwesomeIcon
					icon={activity.icon}
					className="[color:var(--bg-shade-four-color)] mr-3 ml-2 mt-1"
				/>
			)}
			<span>{element.name}</span>
		</div>
	);
};

export default CourseNavigationActivity;
