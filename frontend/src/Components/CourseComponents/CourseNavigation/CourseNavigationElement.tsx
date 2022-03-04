import { CourseElement } from '../../../Models/Course/course_element.entity';
import CourseNavigationSection from './CourseNavigationSection';
import CourseNavigationActivity from './CourseNavigationActivity';

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
