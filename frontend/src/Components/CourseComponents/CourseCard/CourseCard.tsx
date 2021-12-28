import { CourseCardProps, StyledCourseCard } from './courseCardTypes';
import useRoutes from '../../../state/hooks/useRoutes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatTooLong } from '../../../Types/formatting';

/**
 * Card that shows all the information of a course and lets you access to it
 *
 * @param {course} course course object
 *
 * @author MoSk3
 */
const CourseCard = ({ course }: CourseCardProps) => {
	const { routes, goTo } = useRoutes();

	return (
		<StyledCourseCard
			onClick={() => goTo(routes.auth.course.path.replace(':id', course.id))}
		>
			<div className="top-card">
				<FontAwesomeIcon icon={course.getSubjectIcon()} />
			</div>
			<div className="bottom-card">{formatTooLong(course.name, 30)}</div>
		</StyledCourseCard>
	);
};

export default CourseCard;