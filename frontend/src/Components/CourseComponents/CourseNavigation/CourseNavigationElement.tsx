import {
	CourseElement,
	CourseElementActivity,
} from '../../../Models/Course/course_element.entity';
import CourseNavigationSection from './CourseNavigationSection';
import CourseNavigationActivity from './CourseNavigationActivity';
import { CourseElementSection } from '../../../Models/Course/course_element.entity';
import { classNames } from '../../../Types/utils';

/**
 * Activity element appearing in the navigation menu.
 * Possibility to click on the element to open the activity
 * inside the CourseBody (To the right of the navigation)
 *
 * @author Enric Soldevila
 */
const CourseNavigationElement = ({ element }: { element: CourseElement }) => {
	return (
		<div className={classNames('w-full', !element.isVisible && 'opacity-50')}>
			{element?.section ? (
				<CourseNavigationSection element={element as CourseElementSection} />
			) : element?.activity ? (
				<CourseNavigationActivity element={element as CourseElementActivity} />
			) : (
				<div>ERREUR</div>
			)}
		</div>
	);
};

export default CourseNavigationElement;
