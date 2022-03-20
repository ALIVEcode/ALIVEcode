import { useContext } from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';
import Activity from '../Activities/Activity';

/**
 * Content of the CourseElement presently opened.
 * Sits to the right of the navigation menu
 *
 * @author Enric Soldevila
 */
const CourseBody = () => {
	const { openedActivity: activity } = useContext(CourseContext);

	return (
		<>
			{!activity ? (
				<div className="w-full h-full flex justify-center items-center">
					<label>Open an activity to get started</label>
				</div>
			) : (
				<Activity activity={activity} />
			)}
		</>
	);
};

export default CourseBody;
