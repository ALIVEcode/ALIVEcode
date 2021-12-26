import { RouteProps, useNavigate } from 'react-router-dom';
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
import ASDocs from '../../Components/AliveScriptComponents/ASDocs/ASDocs';
import { MaintenanceError } from '../../Pages/Errors/MaintenanceError/MaintenanceError';
import MaintenanceMenu from '../../Pages/SiteStatus/MaintenanceMenu/MaintenanceMenu';
import ASBuiltinsDocs from '../../Components/AliveScriptComponents/ASDocs/ASBuiltinsDocs';
import ActivityEditor from '../../Components/CourseComponents/MDEditor/ActivityEditor';
import ForumHome from '../../Pages/Forum/ForumHome/ForumHome';
import QuizHome from '../../Pages/Quiz/QuizHome/QuizHome';
import QuizCategory from '../../Pages/Quiz/QuizCategory/QuizCategory';
import QuizCreate from '../../Pages/Quiz/QuizCreate/QuizCreate';
import QuizEdit from '../../Pages/Quiz/QuizEdit/QuizEdit';
import QuizPlay from '../../Pages/Quiz/QuizPlay/QuizPlay';
import ForumCategories from '../../Pages/Forum/ForumCategories/ForumCategories';
import ForumSubjectList from '../../Pages/Forum/ForumSubjectList/ForumSubjectList';
import ForumFormQuestion from '../../Pages/Forum/ForumFormQuestion/ForumFormQuestion';
import ForumPost from '../../Pages/Forum/ForumPost/ForumPost';
import ForumSearch from '../../Pages/Forum/ForumSearch/ForumSearch';
import Chat from '../../Pages/Chat/Chat';
import { LEVEL_TYPE } from '../../Models/Level/level.entity';

export interface Route {
	path: string;
	exact?: boolean;
	component?: React.ReactNode | null;
	maintenanceExempt?: boolean;
	adminOnly?: boolean;

	// Do not set manually
	hasAccess?: boolean;
}

export interface AuthRoute extends Route {
	redirect?: React.ReactNode;
	accountType?: typeof Professor | typeof Student;
}

export interface RoutesGroup<T extends Route> {
	[key: string]: T;
}

const useRoutes = () => {
	const { user, maintenance } = useContext(UserContext);
	const navigate = useNavigate();

	const asRoutes = <T extends RoutesGroup<Route>>(routeGroup: T): T => {
		Object.values(routeGroup).forEach(route => {
			if (route.adminOnly && !user?.isAdmin) {
				route.component = <NotFound></NotFound>;
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
					route.component = <MaintenanceError></MaintenanceError>;
					route.hasAccess = false;
				}
			}
		});
		return routeGroup;
	};

	const asAuthRoutes = <T extends RoutesGroup<AuthRoute>>(
		defaultRedirect: React.ReactNode,
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
		defaultRedirect: React.ReactNode,
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
			component: <Test></Test>,
			adminOnly: true,
		},
		home: {
			exact: true,
			path: '/',
			component: <Home></Home>,
			maintenanceExempt: true,
		},
		asDocs: {
			path: '/as/doc',
			component: <ASDocs></ASDocs>,
		},
		asBuiltinsDocs: {
			path: '/as/builtins',
			component: <ASBuiltinsDocs></ASBuiltinsDocs>,
		},
		ai: {
			path: '/aliveai',
			component: <AliveIa></AliveIa>,
			maintenanceExempt: true,
		},
		about: {
			path: '/about',
			component: <About></About>,
			maintenanceExempt: true,
		},
		amc: {
			path: '/amc',
			component: <NotFound></NotFound>,
		},
		en: {
			// Route for switching language to english
			path: '/en',
			component: <Home></Home>,
		},
		fr: {
			// Route for switching language to french
			path: '/fr',
			component: <Home></Home>,
		},
		iot: {
			exact: true,
			path: '/iot',
			component: <IoTHome></IoTHome>,
			//adminOnly: true,
		},
		level_alive: {
			path: '/level/play/alive',
			component: <Level type={LEVEL_TYPE.ALIVE} editMode />,
		},
		level_code: {
			path: '/level/play/code',
			component: <Level type={LEVEL_TYPE.CODE} editMode />,
		},
		maintenances: {
			path: '/maintenances',
			exact: true,
			maintenanceExempt: true,
			component: <MaintenanceMenu></MaintenanceMenu>,
		},
		question: {
			path: '/forum/post/:id',
			component: <ForumPost></ForumPost>,
		},
		subject_list: {
			path: '/forum/subjectList/:id',
			component: <ForumSubjectList></ForumSubjectList>,
		},
		album: {
			path: '/album-test',
			exact: true,
			component: <ActivityEditor></ActivityEditor>,
			adminOnly: true,
		},
		forum: {
			path: '/forum',
			component: <ForumHome></ForumHome>,
			exact: true,
			adminOnly: true,
		},
		forum_search: {
			path: '/forum/search',
			component: <ForumSearch></ForumSearch>,
			adminOnly: true,
		},
		forum_categories: {
			path: '/forum/categories',
			component: <ForumCategories></ForumCategories>,
			adminOnly: true,
		},
		quiz: {
			path: '/quiz',
			exact: true,
			component: <QuizHome></QuizHome>,
			adminOnly: true,
		},
		quiz_category: {
			path: '/quiz/category/:id',
			component: <QuizCategory></QuizCategory>,
			adminOnly: true,
		},
		quiz_play: {
			path: '/quiz/play/:id',
			component: <QuizPlay></QuizPlay>,
			adminOnly: true,
		},
	});

	const auth_routes = asAuthRoutes(<SignIn></SignIn>, {
		dashboard: {
			path: '/dashboard',
			component: <Dashboard></Dashboard>,
		},
		create_classroom: {
			accountType: Professor,
			path: '/classroom/create',
			component: <ClassroomForm></ClassroomForm>,
		},
		join_classroom: {
			accountType: Student,
			path: '/classroom/join',
			component: <ClassroomForm></ClassroomForm>,
		},
		classroom: {
			path: '/classroom/:id',
			component: <Classroom></Classroom>,
		},
		create_course: {
			path: '/course/create',
			component: <CourseForm></CourseForm>,
		},
		course: {
			path: '/course/:id',
			component: <Course></Course>,
		},
		account: {
			path: '/account',
			component: <AccountPage></AccountPage>,
		},
		chat: {
			path: '/chat',
			exact: true,
			component: <Chat></Chat>,
			adminOnly: true,
		},
		iot_dashboard: {
			path: '/iot/dashboard',
			component: <IoTDashboard></IoTDashboard>,
			//adminOnly: true,
		},
		create_iot_project: {
			path: '/iot/projects/create',
			component: <IoTProjectCreate></IoTProjectCreate>,
			//adminOnly: true,
		},
		iot_project: {
			path: '/iot/projects/:id',
			component: <IoTProject></IoTProject>,
			//adminOnly: true,
		},
		level_list: {
			path: '/level',
			exact: true,
			component: <LevelList></LevelList>,
		},
		level_edit: {
			path: '/level/edit/:levelId',
			component: <Level editMode />,
		},
		level_browse: {
			path: '/level/browse',
			component: <LevelBrowse></LevelBrowse>,
		},
		level_play: {
			path: '/level/play/:levelId',
			component: <Level editMode={false}></Level>,
		},
		level_create: {
			path: '/level/create',
			exact: true,
			component: <LevelFormMenu></LevelFormMenu>,
		},
		level_create_alive: {
			path: '/level/create/alive',
			component: <LevelForm type={LEVEL_TYPE.ALIVE} />,
		},
		level_create_code: {
			path: '/level/create/code',
			component: <LevelForm type={LEVEL_TYPE.CODE} />,
		},
		level_create_ai: {
			path: '/level/create/ai',
			component: <LevelForm type={LEVEL_TYPE.AI} />,
		},
		level_create_iot: {
			path: '/level/create/iot',
			component: <LevelForm type={LEVEL_TYPE.IOT} />,
		},
		quiz_create: {
			accountType: Professor,
			path: '/quiz/create',
			component: <QuizCreate></QuizCreate>,
			adminOnly: true,
		},
		quiz_edit: {
			accountType: Professor,
			path: '/quiz/edit/:id',
			component: <QuizEdit></QuizEdit>,
			adminOnly: true,
		},
		form_question: {
			path: '/formQuestion/forum',
			component: <ForumFormQuestion></ForumFormQuestion>,
		},
	});

	const non_auth_routes = asNonAuthRoutes(<Home></Home>, {
		signin: {
			path: '/signin',
			component: <SignIn></SignIn>,
			maintenanceExempt: true,
		},
		signup: {
			path: '/signup',
			component: <SignUpMenu></SignUpMenu>,
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
			component: <NotFound></NotFound>,
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
		goTo: (path: string) => navigate(path),
		goToNewTab: (path: string) => window.open(path, '_blank'),
		goBack: () => navigate(-1),
	};
};

export default useRoutes;