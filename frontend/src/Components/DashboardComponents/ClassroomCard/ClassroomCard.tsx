import { ClassRoomCardProps, StyledClassroomCard } from './classroomCardTypes';
import IconButton from '../IconButton/IconButton';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { Badge } from 'react-bootstrap';
import { prettyField } from '../../../Types/formatting';
import useRoutes from '../../../state/hooks/useRoutes';

/**
 * Card that shows all the information of a classroom and lets you access to it
 *
 * @param {Classroom} classroom classroom object
 *
 * @author MoSk3
 */
const ClassroomCard = ({ classroom }: ClassRoomCardProps) => {
	const { t } = useTranslation();
	const { routes } = useRoutes();

	return (
		<StyledClassroomCard>
			<div className="flip-card-inner">
				<div className="flip-card-front text-white">
					<div className="card-body">
						<h4>{classroom.name}</h4>
						<FontAwesomeIcon icon={faAngleRight} size="5x" />
					</div>
				</div>
				<div className="flip-card-back">
					<div>
						<h3>{classroom.name}</h3>
						<h4>
							<Badge variant="primary">{t('classroom.subject')}</Badge>
						</h4>
						{classroom.getSubjectDisplay()}
						<h4>
							<Badge variant="primary">
								{prettyField(t('msg.description'))}
							</Badge>
						</h4>
						<p className="mb-2">
							{classroom.description
								? classroom.description
								: t('classroom.desc', {
										professor: classroom.creator.getDisplayName(),
								  })}
						</p>
						<IconButton
							to={routes.auth.classroom.path.replace(':id', classroom.id)}
							size="3x"
							icon={faAngleRight}
						/>
					</div>
				</div>
			</div>
		</StyledClassroomCard>
	);
};

export default ClassroomCard;