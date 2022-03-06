import { CourseElement } from '../../../Models/Course/course_element.entity';
import CourseNavigationSection from './CourseNavigationSection';
import CourseNavigationActivity from './CourseNavigationActivity';

/**
 * Activity element appearing in the navigation menu.
 * Possibility to click on the element to open the activity
 * inside the CourseBody (To the right of the navigation)
 *
 * @author Enric Soldevila
 */
const CourseNavigationElement = ({ element }: { element: CourseElement }) => {
	return (
		<div className="w-full">
			{element?.section ? (
				<CourseNavigationSection element={element} />
			) : element?.activity ? (
				<CourseNavigationActivity element={element} />
			) : (
				<div>ERREUR</div>
			)}
		</div>
	);
};

export default CourseNavigationElement;
