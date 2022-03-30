import {
	DashboardNewProps,
	DashboardTabs,
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
import DashboardChallenges from '../../Components/DashboardComponents/DashboardChallenges/DashboardChallenges';
import { Challenge } from '../../Models/Challenge/challenge.entity';
import Button from '../../Components/UtilsComponents/Buttons/Button';
import CourseSection from '../../Components/DashboardComponents/CourseSection/CourseSection';
import ResourceMenu from '../ResourceMenu/ResourceMenu';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import MenuCourseCreation from '../../Components/Resources/MenuCourseCreation/MenuCourseCreation';

/**
 * State reducer to change the state of the selected tab
 * @param state Current state of the reducer
 * @param action Action parameters to change the state of the reducer
 * @returns The new state of the reducer
 */
const SwitchTabReducer = (
	state: { tab: DashboardTabs; classroom?: ClassroomModel },
	action: SwitchTabActions,
): { tab: DashboardTabs; classroom?: ClassroomModel } => {
	switch (action.tab) {
		case 'classrooms':
			if (action.classroom) {
				return { tab: action.tab, classroom: action.classroom };
			}
			return SwitchTabReducer(state, {
				tab: 'recents',
			});
		case 'recents':
		case 'challenges':
		case 'resources':
		default:
			return { tab: action.tab };
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
	const [openFormCreateCourse, setOpenFormCreateCourse] = useState(false);
	const [classroomForCourse, setClassroomForCourse] =
		useState<ClassroomModel>();
	const [formJoinClassOpen, setFormJoinClassOpen] = useState(false);
	const [hoveringClassroom, setHoveringClassroom] = useState(false);
	const [hoveringCourse, setHoveringCourse] = useState(false);
	useState<ClassroomModel | null>(null);
	const navigate = useNavigate();
	const query = useQuery();
	const { pathname } = useLocation();
	const [tabSelected, setTabSelected] = useReducer(SwitchTabReducer, {
		tab: 'recents',
	});
	const [recentCourses, setRecentCourses] = useState<Course[]>();
	const [challenges, setChallenges] = useState<Challenge[]>();

	useEffect(() => {
		if (pathname.endsWith('recents') && tabSelected.tab !== 'recents')
			setTabSelected({ tab: 'recents' });
		else if (
			pathname.endsWith('challenges') &&
			tabSelected.tab !== 'challenges'
		)
			setTabSelected({ tab: 'challenges' });
		else if (
			pathname.endsWith('resources') &&
			tabSelected.tab !== 'resources' &&
			user?.isProfessor()
		)
			setTabSelected({ tab: 'resources' });
		else if (pathname.includes('classroom')) {
			const classroomId = query.get('id');
			if (tabSelected.classroom?.id === classroomId) return;
			const classroom = classrooms.find(c => c.id === classroomId);
			if (!classroom) return;
			setTabSelected({ tab: 'classrooms', classroom });
		}
	}, [
		classrooms,
		pathname,
		query,
		tabSelected.classroom?.id,
		tabSelected.tab,
		user,
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
	 * Opens the challenges tab
	 */
	const openChallenges = () => {
		query.delete('id');
		navigate({
			pathname: `/dashboard/challenges`,
			search: query.toString(),
		});
	};

	const openResources = () => {
		query.delete('id');
		navigate({
			pathname: `/dashboard/resources`,
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
		switch (tabSelected.tab) {
			case 'recents':
				return <DashboardRecents />;
			case 'challenges':
				return <DashboardChallenges />;
			case 'classrooms':
				if (!tabSelected.classroom) return;
				return (
					<Classroom
						key={tabSelected.classroom.id}
						classroomProp={tabSelected.classroom}
					/>
				);
			case 'resources':
				return <ResourceMenu />;
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
	 * Loads the current challenges of the user from the database
	 */
	const loadChallenges = useCallback(async () => {
		if (!user) return;
		const challenges = await api.db.users.getChallenges({ id: user.id });
		setChallenges(challenges);
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
			getChallenges: () => {
				if (!challenges) {
					loadChallenges();
					return [];
				}
				return challenges;
			},
			setFormJoinClassOpen,
			setOpenFormCreateCourse: (state: boolean, classroom?: ClassroomModel) => {
				setOpenFormCreateCourse(state);
				setClassroomForCourse(classroom);
			},
		};
	}, [
		classrooms,
		recentCourses,
		challenges,
		loadRecentCourses,
		loadChallenges,
	]);

	return (
		<StyledDashboard>
			<DashboardContext.Provider value={ctx}>
				<div className="flex h-full overflow-auto">
					<div className="sidebar overflow-y-auto break-words no-float w-1/4 table:1/6 laptop:1/8 desktop:1/12">
						<div
							className={
								'sidebar-btn ' +
								(tabSelected.tab === 'recents' ? 'sidebar-selected' : '')
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
								(tabSelected.tab === 'challenges' ? 'sidebar-selected' : '')
							}
							onClick={openChallenges}
						>
							<FontAwesomeIcon className="sidebar-icon" icon={faStar} />
							<label className="sidebar-btn-text">
								{t('dashboard.challenges.title')}
							</label>
						</div>
						{user?.isProfessor() && (
							<div
								className={
									'sidebar-btn ' +
									(tabSelected.tab === 'resources' ? 'sidebar-selected' : '')
								}
								onClick={openResources}
							>
								<FontAwesomeIcon className="sidebar-icon" icon={faFile} />
								<label className="sidebar-btn-text">
									{t('dashboard.resources.title')}
								</label>
							</div>
						)}

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
											onClick={() => setOpenFormCreateCourse(true)}
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
											onClick={() => setOpenFormCreateCourse(true)}
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
			<MenuCourseCreation
				open={openFormCreateCourse}
				setOpen={setOpenFormCreateCourse}
				classroom={classroomForCourse}
			/>
		</StyledDashboard>
	);
};

export default DashboardNew;
