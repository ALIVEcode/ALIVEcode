import {
	DashboardNewProps,
	StyledDashboard,
	SwitchTabActions,
} from './dashboardNewTypes';
import {
	useContext,
	useState,
	useEffect,
	useReducer,
	useMemo,
	useCallback,
} from 'react';
import { UserContext } from '../../state/contexts/UserContext';
import api from '../../Models/api';
import FormModal from '../../Components/UtilsComponents/FormModal/FormModal';
import JoinClassroomForm from '../../Components/ClassroomComponents/JoinClassroomForm/JoinClassroomForm';
import { useTranslation } from 'react-i18next';
import { Classroom as ClassroomModel } from '../../Models/Classroom/classroom.entity';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faBook,
	faHistory,
	faStar,
	faPlus,
	faTasks,
} from '@fortawesome/free-solid-svg-icons';
import ClassroomSection from '../../Components/DashboardComponents/ClassroomSection/ClassroomSection';
import Classroom from '../Classroom/Classroom';
import { useLocation } from 'react-router';
import { useQuery } from '../../state/hooks/useQuery';
import DashboardRecents from '../../Components/DashboardComponents/DashboardRecents/DashboardRecents';
import {
	DashboardContext,
	DashboardContextValues,
} from '../../state/contexts/DashboardContext';
import { Course } from '../../Models/Course/course.entity';
import { useNavigate } from 'react-router-dom';
import useRoutes from '../../state/hooks/useRoutes';
import DashboardLevels from '../../Components/DashboardComponents/DashboardLevels/DashboardLevels';
import { Challenge } from '../../Models/Level/challenge.entity';
import Button from '../../Components/UtilsComponents/Buttons/Button';
import CourseSection from '../../Components/DashboardComponents/CourseSection/CourseSection';

/**
 * State reducer to change the state of the selected tab
 * @param state Current state of the reducer
 * @param action Action parameters to change the state of the reducer
 * @returns The new state of the reducer
 */
const SwitchTabReducer = (
	state: { index: number; classroom?: ClassroomModel },
	action: SwitchTabActions,
): { index: number; classroom?: ClassroomModel } => {
	switch (action.type) {
		case 'recents':
			return { index: 0 };
		case 'levels':
			return { index: 1 };
		case 'classrooms':
			if (action.classroom) {
				return { index: 2, classroom: action.classroom };
			}
			return SwitchTabReducer(state, {
				type: 'recents',
			});
		default:
			return { index: 0 };
	}
};

/**
 * Dashboard page that contains all the links to the different pages of the plaform
 *
 * @author Enric Soldevila
 */
const DashboardNew = (props: DashboardNewProps) => {
	const { user } = useContext(UserContext);
	const { t } = useTranslation();
	const { routes } = useRoutes();
	const [classrooms, setClassrooms] = useState<ClassroomModel[]>([]);
	const [courses, setCourses] = useState<Course[]>([]);
	const [formJoinClassOpen, setFormJoinClassOpen] = useState(false);
	const [hoveringClassroom, setHoveringClassroom] = useState(false);
	const [hoveringCourse, setHoveringCourse] = useState(false);
	useState<ClassroomModel | null>(null);
	const navigate = useNavigate();
	const query = useQuery();
	const { pathname } = useLocation();
	const [tabSelected, setTabSelected] = useReducer(SwitchTabReducer, {
		index: 0,
	});
	const [recentCourses, setRecentCourses] = useState<Course[]>();
	const [levels, setLevels] = useState<Challenge[]>();

	useEffect(() => {
		if (pathname.endsWith('recents') && tabSelected.index !== 0)
			setTabSelected({ type: 'recents' });
		else if (pathname.endsWith('levels') && tabSelected.index !== 1)
			setTabSelected({ type: 'levels' });
		else if (pathname.includes('classroom')) {
			const classroomId = query.get('id');
			if (tabSelected.classroom?.id === classroomId) return;
			const classroom = classrooms.find(c => c.id === classroomId);
			if (!classroom) return;
			setTabSelected({ type: 'classrooms', classroom });
		}
	}, [
		classrooms,
		navigate,
		pathname,
		query,
		tabSelected.classroom?.id,
		tabSelected.index,
	]);

	useEffect(() => {
		if (!user) return;
		const getClassrooms = async () => {
			setClassrooms(await user.getClassrooms());
			if (user.isProfessor()) {
				setCourses(await user.getCourses());
			}
		};
		getClassrooms();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/**
	 * Opens the recents tab
	 */
	const openRecents = () => {
		query.delete('id');
		navigate({
			pathname: `/dashboard/recents`,
			search: query.toString(),
		});
	};

	/**
	 * Opens the levels tab
	 */
	const openLevels = () => {
		query.delete('id');
		navigate({
			pathname: `/dashboard/levels`,
			search: query.toString(),
		});
	};

	/**
	 * Opens the classrooms tab
	 */
	const openClassroom = (classroom: ClassroomModel) => {
		query.set('id', classroom.id);
		navigate({
			pathname: `/dashboard/classroom`,
			search: query.toString(),
		});
	};

	/**
	 * Renders the tab currently selected
	 */
	const renderTabSelected = () => {
		switch (tabSelected.index) {
			case 0:
				return <DashboardRecents></DashboardRecents>;
			case 1:
				return <DashboardLevels></DashboardLevels>;
			case 2:
				if (!tabSelected.classroom) return;
				return (
					<Classroom
						key={tabSelected.classroom.id}
						classroomProp={tabSelected.classroom}
					/>
				);
		}
	};

	/**
	 * Loads the courses of the user from the database
	 */
	const loadRecentCourses = useCallback(async () => {
		if (!user) return;
		const courses = await api.db.users.getRecentCourses({ id: user.id });
		setRecentCourses(courses);
	}, [user]);

	/**
	 * Loads the current levels of the user from the database
	 */
	const loadLevels = useCallback(async () => {
		if (!user) return;
		const levels = await api.db.users.getChallenges({ id: user.id });
		setLevels(levels);
	}, [user]);

	/**
	 * Memoized version of the context values.
	 * (Used to optimize the rendering)
	 */
	const ctx: DashboardContextValues = useMemo(() => {
		return {
			getCourses: () => {
				if (!recentCourses) {
					loadRecentCourses();
					return [];
				}
				return recentCourses;
			},
			getClassrooms: () => {
				return classrooms;
			},
			getLevels: () => {
				if (!levels) {
					loadLevels();
					return [];
				}
				return levels;
			},
			setFormJoinClassOpen,
		};
	}, [classrooms, recentCourses, levels, loadRecentCourses, loadLevels]);

	return (
		<StyledDashboard>
			<DashboardContext.Provider value={ctx}>
				<div className="flex h-full overflow-auto">
					<div className="sidebar overflow-y-auto break-words no-float w-1/4 table:1/6 laptop:1/8 desktop:1/12">
						<div
							className={
								'sidebar-btn ' +
								(tabSelected.index === 0 ? 'sidebar-selected' : '')
							}
							onClick={openRecents}
						>
							<FontAwesomeIcon className="sidebar-icon" icon={faHistory} />
							<label className="sidebar-btn-text">
								{t('dashboard.recents.title')}
							</label>
						</div>
						<div
							className={
								'sidebar-btn ' +
								(tabSelected.index === 1 ? 'sidebar-selected' : '')
							}
							onClick={openLevels}
						>
							<FontAwesomeIcon className="sidebar-icon" icon={faStar} />
							<label className="sidebar-btn-text">
								{t('dashboard.levels.title')}
							</label>
						</div>

						<hr />

						<div
							className="sidebar-header"
							onMouseEnter={() => setHoveringClassroom(true)}
							onMouseLeave={() => setHoveringClassroom(false)}
						>
							<FontAwesomeIcon className="sidebar-icon" icon={faBook} />
							<label className="sidebar-header-text">
								{t('dashboard.classrooms.title')}
							</label>
							{hoveringClassroom && (
								<FontAwesomeIcon
									onClick={() =>
										user?.isProfessor()
											? navigate(routes.auth.create_classroom.path)
											: setFormJoinClassOpen(true)
									}
									className="sidebar-icon-right cursor-pointer"
									icon={faPlus}
								/>
							)}
						</div>

						<hr />

						{classrooms.length > 0 ? (
							classrooms.map((classroom, idx) => (
								<ClassroomSection
									key={idx}
									selected={tabSelected.classroom?.id === classroom.id}
									onClick={() => openClassroom(classroom)}
									classroom={classroom}
								/>
							))
						) : (
							<div className="!text-xs !text-[color:var(--fg-shade-four-color)] !cursor-default flex flex-col items-center sidebar-classroom">
								<i>
									{user?.isProfessor()
										? t('dashboard.classrooms.empty.professor')
										: t('dashboard.classrooms.empty.student')}
								</i>
								<Button
									className="!text-xs mt-2"
									onClick={() =>
										user?.isProfessor()
											? navigate(routes.auth.create_classroom.path)
											: setFormJoinClassOpen(true)
									}
									variant="primary"
								>
									{user?.isProfessor()
										? t('dashboard.classrooms.add.professor')
										: t('dashboard.classrooms.add.student')}
								</Button>
							</div>
						)}

						{user?.isProfessor() && (
							<>
								<div
									className="sidebar-header"
									onMouseEnter={() => setHoveringCourse(true)}
									onMouseLeave={() => setHoveringCourse(false)}
								>
									<FontAwesomeIcon className="sidebar-icon" icon={faTasks} />
									<label className="sidebar-header-text">
										{t('dashboard.courses.title')}
									</label>
									{hoveringCourse && (
										<FontAwesomeIcon
											onClick={() => navigate(routes.auth.create_course.path)}
											className="sidebar-icon-right cursor-pointer"
											icon={faPlus}
										/>
									)}
								</div>

								<hr />

								{courses.length > 0 ? (
									courses.map((course, idx) => (
										<CourseSection key={idx} course={course} />
									))
								) : (
									<div className="!text-xs !text-[color:var(--fg-shade-four-color)] !cursor-default flex flex-col items-center sidebar-classroom">
										<i>{t('dashboard.courses.empty')}</i>
										<Button
											className="!text-xs mt-2"
											onClick={() => navigate(routes.auth.create_course.path)}
											variant="primary"
										>
											{t('dashboard.courses.add')}
										</Button>
									</div>
								)}
							</>
						)}
					</div>
					<div className="w-3/4 table:5/6 laptop:7/8 desktop:11/12 h-full overflow-y-auto">
						{renderTabSelected()}
					</div>
				</div>
			</DashboardContext.Provider>
			<FormModal
				title={t('form.join_classroom.title')}
				open={formJoinClassOpen}
				setOpen={setFormJoinClassOpen}
			>
				<JoinClassroomForm />
			</FormModal>
		</StyledDashboard>
	);
};

export default DashboardNew;
