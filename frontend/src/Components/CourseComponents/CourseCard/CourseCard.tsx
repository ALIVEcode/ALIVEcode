import { CourseCardProps, StyledCourseCard } from './courseCardTypes';
import useRoutes from '../../../state/hooks/useRoutes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatTooLong } from '../../../Types/formatting';
import { ThemeContext } from '../../../state/contexts/ThemeContext';
import { useContext } from 'react';
import { UserContext } from '../../../state/contexts/UserContext';

/**
 * Card that shows all the information of a course and lets you access to it
 *
 * @param {course} course course object
 *
 * @author Enric Soldevila
 */
const CourseCard = ({ course, onSelect, className }: CourseCardProps) => {
	const { routes, goTo } = useRoutes();
	const { theme } = useContext(ThemeContext);
	const { user } = useContext(UserContext);

	return (
		<StyledCourseCard
			onClick={() =>
				onSelect
					? onSelect(course)
					: goTo(
							routes.auth.course.path.replace(':id', course.id) +
								(user?.id === course.creator?.id ? '/layout' : '/view'),
					  )
			}
			className={
				'shadow-lg text-[color:var(--foreground-color)] inline-block ' +
				className
			}
			theme={theme}
		>
			<div className="top-card">
				<FontAwesomeIcon icon={course.getSubjectIcon()} />
			</div>
			<div className="bottom-card">{formatTooLong(course.name, 30)}</div>
		</StyledCourseCard>
	);
};

export default CourseCard;
