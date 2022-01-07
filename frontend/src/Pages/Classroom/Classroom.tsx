import CardContainer from '../../Components/UtilsComponents/CardContainer/CardContainer';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useState, useEffect, useContext } from 'react';
import { Classroom as ClassroomModel } from '../../Models/Classroom/classroom.entity';
import { useAlert } from 'react-alert';
import api from '../../Models/api';
import LoadingScreen from '../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import StudentCard from '../../Components/ClassroomComponents/StudentCard/StudentCard';
import { UserContext } from '../../state/contexts/UserContext';
import { prettyField } from '../../Types/formatting';
import useRoutes from '../../state/hooks/useRoutes';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router';
import { useForceUpdate } from '../../state/hooks/useForceUpdate';
import { useNavigate } from 'react-router-dom';
import { ClassroomProps } from './classroomTypes';
import ClassroomHeader from '../../Components/ClassroomComponents/ClassroomHeader/ClassroomHeader';
import CourseCard from '../../Components/CourseComponents/CourseCard/CourseCard';
import Badge from '../../Components/UtilsComponents/Badge/Badge';

const StyledDiv = styled.div`
	.classroom-content {
		width: 80%;
		margin-top: 50px;
		padding-bottom: 25px;
	}

	.classroom-header {
		margin-bottom: 60px;
	}
`;

/**
 * Classroom page
 *
 * @param id (as a url parameter)
 * @returns tsx element
 */
const Classroom = ({ classroomProp, ...props }: ClassroomProps) => {
	const { t } = useTranslation();
	const { user } = useContext(UserContext);
	const [classroom, setClassroom] = useState<ClassroomModel | undefined>(
		classroomProp ?? undefined,
	);
	const { id } = useParams<{ id: string }>();
	const { goBack, routes } = useRoutes();
	const navigate = useNavigate();
	const alert = useAlert();
	const forceUpdate = useForceUpdate();

	useEffect(() => {
		const getClassroom = async () => {
			try {
				let classroom = classroomProp;

				if (!classroom) {
					if (!id) return;
					classroom = await api.db.classrooms.get({
						id,
					});
				}

				await classroom.getStudents();
				await classroom.getCourses();
				setClassroom(classroom);
				forceUpdate();
			} catch (err) {
				goBack();
				return alert.error(t('error.not_found', { obj: t('msg.course') }));
			}
		};
		getClassroom();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, classroomProp]);

	if (!classroom || !user) {
		return <LoadingScreen />;
	}

	return (
		<StyledDiv>
			<ClassroomHeader classroom={classroom} />
			<div className="p-2 tablet:p-10 laptop:p-12">
				<CardContainer
					asRow
					title={t('classroom.container.courses.title')}
					height="60px"
					icon={classroom.creator.id === user.id ? faPlus : undefined}
					onIconClick={() =>
						navigate(routes.auth.create_course.path, { state: { classroom } })
					}
				>
					{classroom.courses && classroom.courses.length > 0 ? (
						classroom.courses.map((c, idx) => (
							<CourseCard key={idx} course={c} />
						))
					) : (
						<p>{t('classroom.container.courses.empty')}</p>
					)}
				</CardContainer>
				<div>
					<div>
						<CardContainer title={t('classroom.container.details.title')}>
							<div>
								<h4>
									<Badge variant="third">{t('classroom.subject')}</Badge>
								</h4>
								{classroom.getSubjectDisplay()}
								<h4>
									<Badge variant="third">
										{prettyField(t('msg.description'))}
									</Badge>
								</h4>
								<p>
									{classroom.description
										? classroom.description
										: t('classroom.desc', {
												professor: classroom.creator.getDisplayName(),
										  })}
								</p>
							</div>
						</CardContainer>
					</div>
					<div>
						<CardContainer
							scrollY
							title={t('classroom.container.students.title')}
							height="60px"
						>
							{classroom.students && classroom.students.length > 0 ? (
								classroom.students.map((s, idx) => (
									<StudentCard key={idx} student={s} />
								))
							) : (
								<p>{t('classroom.container.students.empty')}</p>
							)}
						</CardContainer>
					</div>
				</div>
			</div>
		</StyledDiv>
	);
};

export default Classroom;
