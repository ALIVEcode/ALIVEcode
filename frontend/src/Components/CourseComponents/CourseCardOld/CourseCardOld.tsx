import {
	CourseCardOldProps as CourseCardOldProps,
	StyledCourseCardOld,
} from './courseCardOldTypes';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from '../../DashboardComponents/IconButton/IconButton';
import { Badge } from 'react-bootstrap';
import { prettyField } from '../../../Types/formatting';
import { useTranslation } from 'react-i18next';
import useRoutes from '../../../state/hooks/useRoutes';

/**
 * Card that shows all the information of a course and lets you access to it
 *
 * @param {course} course course object
 *
 * @author MoSk3
 */
const CourseCardOld = ({ course }: CourseCardOldProps) => {
	const { t } = useTranslation();
	const { routes } = useRoutes();

	return (
		<StyledCourseCardOld>
			<div className="flip-card-inner">
				<div className="flip-card-front text-white">
					<div className="card-body">
						<h4>{course.name}</h4>
						<FontAwesomeIcon icon={faAngleRight} size="5x" />
					</div>
				</div>
				<div className="flip-card-back">
					<div>
						<h3>{course.name}</h3>
						<h4>
							<Badge variant="primary">{t('course.subject')}</Badge>
						</h4>
						{course.getSubjectDisplay()}
						<h4>
							<Badge variant="primary">
								{prettyField(t('msg.description'))}
							</Badge>
						</h4>
						<p className="mb-2">
							{course.description
								? course.description
								: t('course.desc', {
										professor: course.creator.getDisplayName(),
								  })}
						</p>
						<IconButton
							to={routes.auth.course.path.replace(':id', course.id)}
							size="3x"
							icon={faAngleRight}
						/>
					</div>
				</div>
			</div>
		</StyledCourseCardOld>
	);
};

export default CourseCardOld;