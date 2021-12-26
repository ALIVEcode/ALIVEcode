import { DashboardProps } from './dashboardTypes';
import CenteredContainer from '../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import LabelHighlight from '../../Components/UtilsComponents/LabelHighlight/LabelHighlight';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../state/contexts/UserContext';
import CardContainer from '../../Components/UtilsComponents/CardContainer/CardContainer';
import { useHistory } from 'react-router-dom';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ClassroomCard from '../../Components/DashboardComponents/ClassroomCard/ClassroomCard';
import SmallCard from '../../Components/UtilsComponents/Cards/SmallCard/SmallCard';
import List from '../../assets/images/icons/my_levels.png';
import Puzzle from '../../assets/images/icons/puzzle.png';
import Sandbox from '../../assets/images/icons/sandboxblanc.png';
import Voiture from '../../assets/images/Voiture.gif';
import { Row } from 'react-bootstrap';
import { Classroom } from '../../Models/Classroom/classroom.entity';
import { plainToClass } from 'class-transformer';
import { Professor, Student } from '../../Models/User/user.entity';
import useRoutes from '../../state/hooks/useRoutes';
import api from '../../Models/api';
import FormModal from '../../Components/UtilsComponents/FormModal/FormModal';
import JoinClassroomForm from '../../Components/ClassroomComponents/JoinClassroomForm/JoinClassroomForm';
import { useTranslation } from 'react-i18next';
import LoadingScreen from '../../Components/UtilsComponents/LoadingScreen/LoadingScreen';

/**
 * Dashboard page that contains all the links to the different pages of the plaform
 *
 * @author MoSk3
 */
const Dashboard = (props: DashboardProps) => {
	const { user } = useContext(UserContext);
	const { t } = useTranslation();
	const [loading, setLoading] = useState(true);
	const [classrooms, setClassrooms] = useState<Classroom[]>([]);
	const history = useHistory();
	const { routes } = useRoutes();
	const [formJoinClassOpen, setFormJoinClassOpen] = useState(false);

	useEffect(() => {
		if (!user) return;
		const getClassrooms = async () => {
			const data = await api.db.users.getClassrooms({
				id: user.id,
			});
			setLoading(false);
			setClassrooms(data.map((d: any) => plainToClass(Classroom, d)));
		};
		getClassrooms();
	}, [user]);

	return (
		<>
			<CenteredContainer
				horizontally
				textAlign="center"
				style={{ paddingLeft: '100px', paddingRight: '100px' }}
			>
				<Row style={{ justifyContent: 'center' }}>
					<LabelHighlight
						text={`Bonjour, ${user?.getDisplayName()}`}
						textColor="white"
						padding="25px"
						borderRadius="25px"
						fontSize="45px"
					/>
				</Row>
				<CardContainer
					asRow
					height="60px"
					title={t('dashboard.classrooms.title')}
					style={{ marginTop: '20px' }}
					onIconClick={() =>
						user instanceof Professor
							? history.push(routes.auth.create_classroom.path)
							: setFormJoinClassOpen(true)
					}
					icon={faPlus}
				>
					{loading ? (
						<LoadingScreen />
					) : classrooms.length <= 0 ? (
						user instanceof Student ? (
							t('dashboard.classrooms.empty.student')
						) : (
							t('dashboard.classrooms.empty.professor')
						)
					) : (
						classrooms?.map((classroom, idx) => (
							<ClassroomCard key={idx} classroom={classroom} />
						))
					)}
				</CardContainer>

				<CardContainer asRow title="Niveaux">
					<SmallCard
						to={routes.auth.level_list.path}
						title={t('dashboard.levels.my_levels')}
						img={List}
					/>
					<SmallCard
						to={routes.auth.level_create.path}
						title={t('dashboard.levels.create_level')}
						img={Sandbox}
					/>
					<SmallCard
						to={routes.auth.level_browse.path}
						title={t('dashboard.levels.browse_levels')}
						img={Voiture}
					/>
				</CardContainer>

				<CardContainer
					asRow
					style={{ marginBottom: '100px' }}
					title={t('dashboard.quizzes.title')}
				>
					<SmallCard
						to="/quiz"
						title={t('dashboard.quizzes.my_quizzes')}
						img={List}
					/>
					<SmallCard
						to="/quiz/new"
						title={t('dashboard.quizzes.create_quiz')}
						img={Sandbox}
					/>
					<SmallCard
						to="/quiz/browse"
						title={t('dashboard.quizzes.browse_quizzes')}
						img={Puzzle}
					/>
				</CardContainer>
			</CenteredContainer>
			<FormModal
				title={t('form.join_classroom.title')}
				open={formJoinClassOpen}
				onClose={() => setFormJoinClassOpen(false)}
			>
				<JoinClassroomForm />
			</FormModal>
		</>
	);
};

export default Dashboard;