import { CourseSectionProps } from './courseSectionTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useRoutes from '../../../state/hooks/useRoutes';
import { formatTooLong } from '../../../Types/formatting';
import { classNames } from '../../../Types/utils';

const CourseSection = ({ course, className }: CourseSectionProps) => {
	const { routes, goTo } = useRoutes();

	return (
		<div
			className={classNames(
				'text-[color:var(--fg-shade-three-color)] font-medium cursor-pointer',
				'text-ellipsis whitespace-nowrap overflow-hidden',
				className,
			)}
			onClick={() =>
				goTo(routes.auth.course.path.replace(':id', course.id) + '/layout')
			}
		>
			<FontAwesomeIcon
				className="sidebar-icon"
				icon={course.getSubjectIcon()}
			/>
			<label className="sidebar-course-text">{course.name}</label>
		</div>
	);
};

export default CourseSection;
