import { CourseElement } from '../../../Models/Course/course_element.entity';
import CourseNavigationSection from './CourseNavigationSection';
import CourseNavigationActivity from './CourseNavigationActivity';
import { classNames } from '../../../Types/utils';

const CourseNavigationElement = ({ element }: { element: CourseElement }) => {
	return (
		<div className="w-full">
			<div
				className={classNames(
					'p-3 border-t border-l border-b border-[color:var(--bg-shade-four-color)]',
					element?.section && '',
				)}
			>
				<span>{element.name}</span>
			</div>
			{element?.section ? (
				<CourseNavigationSection courseElement={element} />
			) : element?.activity ? (
				<CourseNavigationActivity courseElement={element} />
			) : (
				<div>ERREUR</div>
			)}
		</div>
	);
};

export default CourseNavigationElement;
