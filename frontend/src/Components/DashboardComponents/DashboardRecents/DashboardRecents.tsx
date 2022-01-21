import { useContext } from 'react';
import { DashboardContext } from '../../../state/contexts/DashboardContext';
import CourseContainer from '../../UtilsComponents/CourseContainer/CourseContainer';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../../state/contexts/UserContext';
import Button from '../../UtilsComponents/Buttons/Button';
import { useNavigate } from 'react-router';
import useRoutes from '../../../state/hooks/useRoutes';

export const DashboardRecents = () => {
	const { getCourses, setFormJoinClassOpen } = useContext(DashboardContext);
	const { t } = useTranslation();
	const { user } = useContext(UserContext);
	const { routes } = useRoutes();
	const navigate = useNavigate();

	const courses = getCourses();

	return (
		<div className="h-full p-4">
			<div className="section-title">{t('dashboard.recents.title')}</div>
			<div className="border-b w-1/3 border-[color:var(--bg-shade-four-color)]"></div>
			{courses.length > 0 ? (
				<CourseContainer courses={getCourses()}></CourseContainer>
			) : (
				<div className="w-full h-[calc(100%-2rem)] text-[color:var(--fg-shade-four-color)] flex flex-col items-center justify-center">
					<i>
						{user?.isProfessor()
							? t('dashboard.recents.empty.professor')
							: t('dashboard.recents.empty.student')}
					</i>
					<Button
						className="!text-xs mt-2"
						variant="primary"
						onClick={() =>
							user?.isProfessor()
								? navigate(routes.auth.create_classroom.path)
								: setFormJoinClassOpen(true)
						}
					>
						{user?.isProfessor()
							? t('dashboard.classrooms.add.professor')
							: t('dashboard.classrooms.add.student')}
					</Button>
				</div>
			)}
		</div>
	);
};

export default DashboardRecents;
