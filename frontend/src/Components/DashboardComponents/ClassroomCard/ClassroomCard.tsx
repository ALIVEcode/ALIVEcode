import { ClassRoomCardProps, StyledClassroomCard } from './classroomCardTypes';
import IconButton from '../IconButton/IconButton';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { prettyField, formatTooLong } from '../../../Types/formatting';
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
 * @author Enric Soldevila
 */
const ClassroomCard = ({ classroom }: ClassRoomCardProps) => {
	const { t } = useTranslation();
	const { routes } = useRoutes();
	const { user } = useContext(UserContext);
	const [userClassrooms, setUserClassrooms] = useState<Classroom[]>();
	const navigate = useNavigate();

	const isInClassroom = userClassrooms?.some(c => c.id === classroom.id);

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
					{isInClassroom && (
						<div className="absolute bottom-4 text-gray-300">
							<i>{t('classroom.already_in')}</i>
						</div>
					)}
					<div className="card-body">
						<div className="text-xl">{classroom.name}</div>
						<FontAwesomeIcon icon={faAngleRight} size="5x" />
					</div>
				</div>
				<div className="flip-card-back">
					<div>
						<h3>{classroom.name}</h3>
						<div>
							<Badge variant="primary">{t('classroom.subject')}</Badge>
						</div>
						{classroom.getSubjectDisplay()}
						<div>
							<Badge variant="primary">
								{prettyField(t('msg.description'))}
							</Badge>
						</div>
						<div className="mb-2">
							<p className="text-xs">
								{classroom.description
									? formatTooLong(classroom.description, 100)
									: t('classroom.desc', {
											professor: classroom.creator.getDisplayName(),
									  })}
							</p>
						</div>
						<IconButton
							onClick={async () => {
								if (!isInClassroom) {
									user?.addClassroom(classroom);
									await api.db.classrooms.join({ code: classroom.code });
								}
								navigate(
									routes.auth.dashboard.path + `/classroom?id=${classroom.id}`,
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
