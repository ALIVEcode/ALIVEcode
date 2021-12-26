import { RouteComponentProps } from 'react-router-dom';
import { Professor, Student } from '../../Models/User/user.entity';
import Classroom from '../../Pages/Classroom/Classroom';
import Course from '../../Pages/Course/Course';
import { NotFound } from '../../Pages/Errors/NotFound/NotFound';
import Home from '../../Pages/Home/Home';
import SignIn from '../../Pages/Account/SignIn/SignIn';
import SignUp from '../../Pages/Account/SignUp/SignUp';
import { USER_TYPES } from '../../Types/userTypes';
import Level from '../../Pages/Level/Level';
import SignUpMenu from '../../Pages/Account/SignUpMenu/SignUpMenu';
import About from '../../Pages/About/About';
import AliveIa from '../../Pages/ALIVEIA/AliveIa';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import AccountPage from '../../Pages/Account/AccountInfo/AccountPage';
import CourseForm from '../../Components/CourseComponents/CourseForm/CourseForm';
import ClassroomForm from '../../Components/ClassroomComponents/ClassroomForm/ClassroomForm';
import Dashboard from '../../Pages/Dashboard/Dashboard';
import IoTHome from '../../Pages/IoT/IoTHome/IoTHome';
import IoTProject from '../../Pages/IoT/IoTProject/IoTProject';
import IoTProjectCreate from '../../Components/IoTComponents/IoTProject/IotProjectForm/IoTProjectCreate';
import IoTDashboard from '../../Pages/IoT/IoTDashboard/IoTDashboard';
import LevelForm from '../../Components/LevelComponents/LevelForm/LevelForm';
import LevelBrowse from '../../Pages/Level/LevelBrowse/LevelBrowse';
import LevelList from '../../Pages/Level/LevelList/LevelList';
import LevelFormMenu from '../../Pages/Level/LevelFormMenu/LevelFormMenu';
import Test from '../../Pages/Test/Test';
import { useHistory } from 'react-router';
import ASDocs from '../../Components/AliveScriptComponents/ASDocs/ASDocs';
import { MaintenanceError } from '../../Pages/Errors/MaintenanceError/MaintenanceError';
import MaintenanceMenu from '../../Pages/SiteStatus/MaintenanceMenu/MaintenanceMenu';
import ASBuiltinsDocs from '../../Components/AliveScriptComponents/ASDocs/ASBuiltinsDocs';
import MDEditor from '../../Components/CourseComponents/MDEditor/MDEditor';
import ActivityEditor from '../../Components/CourseComponents/MDEditor/ActivityEditor';
import Forum from '../../Pages/Forum/Forum';
import QuizHome from '../../Pages/Quiz/QuizHome/QuizHome';
import QuizCategory from '../../Pages/Quiz/QuizCategory/QuizCategory';
import QuizCreate from '../../Pages/Quiz/QuizCreate/QuizCreate';
import CategoriesForum from '../../Pages/Forum/CategoriesForum';
import SubjectList from '../../Pages/Forum/SubjectList';
import FormQuestion from '../../Pages/Forum/formQuestion';
import DetailsQuestion from '../../Pages/Forum/detailsQuestion';
import SearchForum from '../../Pages/Forum/searchForum';
import Chat from '../../Pages/Chat/Chat';
import { LEVEL_TYPE } from '../../Models/Level/level.entity';

type component =
	| React.ComponentType<RouteComponentProps<any>>
	| React.ComponentType<any>;

export interface Route {
	path: string;
	exact?: boolean;
	component?: component;
	maintenanceExempt?: boolean;
	adminOnly?: boolean;

	// Do not set manually
	hasAccess?: boolean;
}

export interface AuthRoute extends Route {
	redirect?: component;
	accountType?: typeof Professor | typeof Student;
}

export interface RoutesGroup<T extends Route> {
	[key: string]: T;
}

const useRoutes = () => {
	const { user, maintenance } = useContext(UserContext);
	const history = useHistory();

	const asRoutes = <T extends RoutesGroup<Route>>(routeGroup: T): T => {
		Object.values(routeGroup).forEach(route => {
			if (route.adminOnly && !user?.isAdmin) {
				route.component = NotFound;
				route.hasAccess = false;
			}

			route.hasAccess = route.hasAccess ?? true;
			if (
				maintenance &&
				maintenance.started &&
				!maintenance.finished &&
				!route.maintenanceExempt
			) {
				if (!user || !user.isAdmin) {
					route.component = MaintenanceError;
					route.hasAccess = false;
				}
			}
		});
		return routeGroup;
	};

	const asAuthRoutes = <T extends RoutesGroup<AuthRoute>>(
		defaultRedirect: component,
		routeGroup: T,
	): T => {
		Object.values(routeGroup).forEach(route => {
			const redirect = route.redirect || defaultRedirect;

			if (
				!user ||
				(route.accountType === Professor && !(user instanceof Professor)) ||
				(route.accountType === Student && !(user instanceof Student))
			) {
				route.component = redirect;
				route.hasAccess = false;
			}
		});
		return asRoutes(routeGroup);
	};

	const asNonAuthRoutes = <T extends RoutesGroup<AuthRoute>>(
		defaultRedirect: component,
		routeGroup: T,
	): T => {
		if (user) {
			Object.values(routeGroup).forEach(route => {
				if (route.redirect) route.component = route.redirect;
				else route.component = defaultRedirect;
			});
		}
		return asRoutes(routeGroup);
	};

	const public_routes = asRoutes({
		test: {
			path: '/test',
			component: Test,
			adminOnly: true,
		},
		home: {
			exact: true,
			path: '/',
			component: Home,
			maintenanceExempt: true,
		},
		asDocs: {
			path: '/as/doc',
			component: ASDocs,
		},
		asBuiltinsDocs: {
			path: '/as/builtins',
			component: ASBuiltinsDocs,
		},
		ai: {
			path: '/aliveai',
			component: AliveIa,
			maintenanceExempt: true,
		},
		about: {
			path: '/about',
			component: About,
			maintenanceExempt: true,
		},
		amc: {
			path: '/amc',
			component: NotFound,
		},
		en: {
			// Route for switching language to english
			path: '/en',
			component: Home,
		},
		fr: {
			// Route for switching language to french
			path: '/fr',
			component: Home,
		},
		iot: {
			exact: true,
			path: '/iot',
			component: IoTHome,
			//adminOnly: true,
		},
		level_alive: {
			path: '/level/play/alive',
			component: () => <Level type={LEVEL_TYPE.ALIVE} editMode />,
		},
		level_code: {
			path: '/level/play/code',
			component: () => <Level type={LEVEL_TYPE.CODE} editMode />,
		},
		maintenances: {
			path: '/maintenances',
			exact: true,
			maintenanceExempt: true,
			component: MaintenanceMenu,
		},
		question: {
			path: '/forum/post/:id',
			component: DetailsQuestion,
		},
		subjectList: {
			path: '/forum/subjectList/:id',
			component: SubjectList,
		},
		searchForum: {
			path: '/forum/searchForum/:id',
			component: SearchForum,
		},
		album: {
			path: '/album-test',
			exact: true,
			component: ActivityEditor,
		},
		forum: {
			path: '/forum',
			component: Forum,
			adminOnly: true,
		},
		categoriesForum: {
			path: '/categoriesForum',
			component: CategoriesForum,
			adminOnly: true,
		},
		quiz: {
			path: '/quiz',
			exact: true,
			component: QuizHome,
			adminOnly: true,
		},
		quiz_category: {
			path: '/quiz/category/:id',
			component: QuizCategory,
			adminOnly: true,
		},
		// Only for testing, place in auth Professor in production.
		quiz_create: {
			path: '/quiz/create',
			component: QuizCreate,
			adminOnly: true,
		},
	});

	const auth_routes = asAuthRoutes(SignIn, {
		dashboard: {
			path: '/dashboard',
			component: Dashboard,
		},
		create_classroom: {
			accountType: Professor,
			path: '/classroom/create',
			component: ClassroomForm,
		},
		join_classroom: {
			accountType: Student,
			path: '/classroom/join',
			component: ClassroomForm,
		},
		classroom: {
			path: '/classroom/:id',
			component: Classroom,
		},
		create_course: {
			path: '/course/create',
			component: CourseForm,
		},
		course: {
			path: '/course/:id',
			component: Course,
		},
		account: {
			path: '/account',
			component: AccountPage,
		},
		chat: {
			path: '/chat',
			exact: true,
			component: Chat,
			adminOnly: true,
		},
		iot_dashboard: {
			path: '/iot/dashboard',
			component: IoTDashboard,
			//adminOnly: true,
		},
		create_iot_project: {
			path: '/iot/projects/create',
			component: IoTProjectCreate,
			//adminOnly: true,
		},
		iot_project: {
			path: '/iot/projects/:id',
			component: IoTProject,
			//adminOnly: true,
		},
		level_list: {
			path: '/level',
			exact: true,
			component: LevelList,
		},
		level_edit: {
			path: '/level/edit/:levelId',
			component: () => <Level editMode />,
		},
		level_browse: {
			path: '/level/browse',
			component: LevelBrowse,
		},
		level_play: {
			path: '/level/play/:levelId',
			component: Level,
		},
		level_create: {
			path: '/level/create',
			exact: true,
			component: LevelFormMenu,
		},
		level_create_alive: {
			path: '/level/create/alive',
			component: () => <LevelForm type={LEVEL_TYPE.ALIVE} />,
		},
		level_create_code: {
			path: '/level/create/code',
			component: () => <LevelForm type={LEVEL_TYPE.CODE} />,
		},
		level_create_ai: {
			path: '/level/create/ai',
			component: () => <LevelForm type={LEVEL_TYPE.AI} />,
		},
		level_create_iot: {
			path: '/level/create/iot',
			component: () => <LevelForm type={LEVEL_TYPE.IOT} />,
		},
		formQuestion: {
			path: '/formQuestion/forum',
			component: FormQuestion,
		},
	});

	const non_auth_routes = asNonAuthRoutes(Home, {
		signin: {
			path: '/signin',
			component: SignIn,
			maintenanceExempt: true,
		},
		signup: {
			path: '/signup',
			component: SignUpMenu,
		},
		signup_professor: {
			path: '/signup-professor',
			component: () => <SignUp userType={USER_TYPES.PROFESSOR} />,
		},
		signup_student: {
			path: '/signup-student',
			component: () => <SignUp userType={USER_TYPES.STUDENT} />,
		},
	});

	const error_routes = asRoutes({
		not_found: {
			path: '*',
			component: NotFound,
			maintenanceExempt: true,
		},
	});

	const routes = {
		public: public_routes,
		auth: auth_routes,
		non_auth: non_auth_routes,
		error: error_routes,
	};

	return {
		routes,
		goTo: (path: string) => history.push(path),
		goToNewTab: (path: string) => window.open(path, '_blank'),
		goBack: () => history.goBack(),
	};
};

export default useRoutes;