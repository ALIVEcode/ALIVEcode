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
import { Level } from '../../Models/Level/level.entity';

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
 * @author MoSk3
 */
const DashboardNew = (props: DashboardNewProps) => {
	const { user } = useContext(UserContext);
	const { t } = useTranslation();
	const { routes } = useRoutes();
	const [classrooms, setClassrooms] = useState<ClassroomModel[]>([]);
	const [formJoinClassOpen, setFormJoinClassOpen] = useState(false);
	const [hoveringClassroom, setHoveringClassroom] = useState(false);
	useState<ClassroomModel | null>(null);
	const navigate = useNavigate();
	const query = useQuery();
	const { pathname } = useLocation();
	const [tabSelected, setTabSelected] = useReducer(SwitchTabReducer, {
		index: 0,
	});
	const [courses, setCourses] = useState<Course[]>();
	const [levels, setLevels] = useState<Level[]>();

	useEffect(() => {
		if (pathname.endsWith('recents') && tabSelected.index !== 0)
			setTabSelected({ type: 'recents' });
		else if (pathname.endsWith('levels') && tabSelected.index !== 1)
			setTabSelected({ type: 'levels' });
		else if (pathname.includes('classroom') && tabSelected.index !== 2) {
			const classroomId = query.get('id');
			const classroom = classrooms.find(c => c.id === classroomId);
			if (!classroom) return;
			setTabSelected({ type: 'classrooms', classroom });
		}
	}, [classrooms, navigate, pathname, query, tabSelected.index]);

	useEffect(() => {
		if (!user) return;
		const getClassrooms = async () => {
			const data = await api.db.users.getClassrooms({
				id: user.id,
			});
			setClassrooms(data);
		};
		getClassrooms();
	}, [user]);

	const openRecents = () => {
		query.delete('id');
		navigate({
			pathname: `/dashboard/recents`,
			search: query.toString(),
		});
	};

	const openLevels = () => {
		query.delete('id');
		navigate({
			pathname: `/dashboard/levels`,
			search: query.toString(),
		});
	};

	const openClassroom = (classroom: ClassroomModel) => {
		query.set('id', classroom.id);
		navigate({
			pathname: `/dashboard/classroom`,
			search: query.toString(),
		});
	};

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

	const loadCourses = useCallback(async () => {
		if (!user) return;
		const courses = await api.db.users.getRecentCourses({ id: user.id });
		setCourses(courses);
	}, [user]);

	const loadLevels = useCallback(async () => {
		if (!user) return;
		const levels = await api.db.users.getLevels({ id: user.id });
		setLevels(levels);
	}, [user]);

	const ctx: DashboardContextValues = useMemo(() => {
		return {
			getCourses: () => {
				if (!courses) {
					loadCourses();
					return [];
				}
				return courses;
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
		};
	}, [classrooms, courses, levels, loadCourses, loadLevels]);

	return (
		<StyledDashboard>
			<DashboardContext.Provider value={ctx}>
				<div className="flex h-full overflow-auto">
					<div className="sidebar no-float w-1/4 table:1/6 laptop:1/8 desktop:1/12">
						<div
							className={
								'sidebar-btn ' +
								(tabSelected.index === 0 ? 'sidebar-selected' : '')
							}
							onClick={openRecents}
						>
							<FontAwesomeIcon className="sidebar-icon" icon={faHistory} />
							<label className="sidebar-btn-text">Formations Récentes</label>
						</div>
						<div
							className={
								'sidebar-btn ' +
								(tabSelected.index === 1 ? 'sidebar-selected' : '')
							}
							onClick={openLevels}
						>
							<FontAwesomeIcon className="sidebar-icon" icon={faStar} />
							<label className="sidebar-btn-text">Niveaux</label>
						</div>

						<hr />

						<div
							className="sidebar-header"
							onMouseEnter={() => setHoveringClassroom(true)}
							onMouseLeave={() => setHoveringClassroom(false)}
						>
							<FontAwesomeIcon className="sidebar-icon" icon={faBook} />
							<label className="sidebar-header-text">Classes</label>
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

						{classrooms.map((classroom, idx) => (
							<ClassroomSection
								key={idx}
								selected={tabSelected.classroom?.id === classroom.id}
								onClick={() => openClassroom(classroom)}
								classroom={classroom}
							></ClassroomSection>
						))}
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
