import { ClassRoomCardProps, StyledClassroomCard } from './classroomCardTypes';
import IconButton from '../IconButton/IconButton';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { prettyField } from '../../../Types/formatting';
import useRoutes from '../../../state/hooks/useRoutes';
import Badge from '../../UtilsComponents/Badge/Badge';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../../state/contexts/UserContext';
import { Classroom } from '../../../Models/Classroom/classroom.entity';
import api from '../../../Models/api';
import { useNavigate } from 'react-router';

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
	const { user } = useContext(UserContext);
	const [userClassrooms, setUserClassrooms] = useState<Classroom[]>();
	const navigate = useNavigate();

	useEffect(() => {
		const getClassrooms = async () => {
			setUserClassrooms(await user?.getClassrooms());
		};
		getClassrooms();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
							onClick={async () => {
								const isInClassroom = userClassrooms?.some(
									c => c.id === classroom.id,
								);
								if (!isInClassroom) {
									user?.addClassroom(classroom);
									await api.db.classrooms.join({ code: classroom.code });
								}
								navigate(
									routes.auth.classroom.path.replace(':id', classroom.id),
								);
							}}
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
