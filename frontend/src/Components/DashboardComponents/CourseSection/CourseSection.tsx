import { CourseSectionProps } from './courseSectionTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useRoutes from '../../../state/hooks/useRoutes';
import { formatTooLong } from '../../../Types/formatting';

const CourseSection = ({ course }: CourseSectionProps) => {
	const { routes, goTo } = useRoutes();

	return (
		<div
			className="sidebar-course"
			onClick={() =>
				goTo(routes.auth.course.path.replace(':id', course.id) + '/layout')
			}
		>
			<FontAwesomeIcon
				className="sidebar-icon"
				icon={course.getSubjectIcon()}
			/>
			<label className="sidebar-course-text">
				{formatTooLong(course.name, 18)}
			</label>
		</div>
	);
};

export default CourseSection;
