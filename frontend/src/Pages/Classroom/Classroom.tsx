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
import { ClassroomProps } from './classroomTypes';
import ClassroomHeader from '../../Components/ClassroomComponents/ClassroomHeader/ClassroomHeader';
import CourseCard from '../../Components/CourseComponents/CourseCard/CourseCard';
import Badge from '../../Components/UtilsComponents/Badge/Badge';
import { DashboardContext } from '../../state/contexts/DashboardContext';
import Modal from '../../Components/UtilsComponents/Modal/Modal';

const StyledDiv = styled.div`
	background-color: var(--background-color);

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
	const [importModalOpen, setImportModalOpen] = useState(false);
	const { getCourses } = useContext(DashboardContext);
	const [classroom, setClassroom] = useState<ClassroomModel | undefined>(
		classroomProp ?? undefined,
	);
	const { id } = useParams<{ id: string }>();
	const { goBack } = useRoutes();
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

	const courses = getCourses();

	return (
		<StyledDiv>
			<ClassroomHeader classroom={classroom} />
			<div className="px-2 tablet:px-10 laptop:px-12">
				<CardContainer
					asRow
					title={t('classroom.container.courses.title')}
					height="60px"
					icon={classroom.creator.id === user.id ? faPlus : undefined}
					onIconClick={async () => setImportModalOpen(true)}
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
			<Modal
				title={t('classroom.import_course')}
				open={importModalOpen}
				setOpen={setImportModalOpen}
			>
				{courses.length === 0 ? (
					<div>{t('dashboard.courses.empty')}</div>
				) : (
					courses
						.filter(c => !classroom.courses?.some(course => course.id === c.id))
						.map(c => (
							<CourseCard
								onSelect={async () => {
									await api.db.courses.addCourseInsideClassroom(
										c,
										classroom.id,
									);
									await classroom.addCourse(c);
									setImportModalOpen(false);
								}}
								course={c}
							/>
						))
				)}
			</Modal>
		</StyledDiv>
	);
};

export default Classroom;
