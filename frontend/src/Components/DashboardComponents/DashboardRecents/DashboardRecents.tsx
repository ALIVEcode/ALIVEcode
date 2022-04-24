import { useContext, useState } from 'react';
import { DashboardContext } from '../../../state/contexts/DashboardContext';
import CourseContainer from '../../UtilsComponents/CourseContainer/CourseContainer';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../../state/contexts/UserContext';
import Button from '../../UtilsComponents/Buttons/Button';
import { useNavigate } from 'react-router';
import useRoutes from '../../../state/hooks/useRoutes';
import InfoButton from '../../HelpComponents/InfoButton';
import Tutorial from '../../HelpComponents/Tutorial';

export const DashboardRecents = () => {
	const { getCourses, setFormJoinClassOpen, setOpenFormCreateCourse } =
		useContext(DashboardContext);
	const { t } = useTranslation();
	const { user } = useContext(UserContext);
	const { routes } = useRoutes();
	const navigate = useNavigate();

	const courses = getCourses();

	const [timelineOpen, setTimelineOpen] = useState(false);

	return (
		<div className="h-full p-4">
			<div className="section-title flex flex-row justify-between w-1/3">
				{t('dashboard.recents.title')}{' '}
				<InfoButton
					icon={{
						className: 'text-blue-300',
						onClick: () => setTimelineOpen(true),
					}}
					hoverPopup={{
						position: 'right center',
						text:
							'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut deleniti dolorum ea inventore nihil' +
							' quam quis recusandae rem vel voluptate. At cum ea odio vero voluptate. Ad consequatur qui similique.',
					}}
				/>
				<Tutorial.Timeline open={timelineOpen} setOpen={setTimelineOpen}>
					<></>
				</Tutorial.Timeline>
			</div>
			<div className="border-b w-1/3 border-[color:var(--bg-shade-four-color)]" />
			{courses.length > 0 ? (
				<CourseContainer courses={getCourses()} />
			) : (
				<div className="w-full h-[calc(100%-2rem)] text-[color:var(--fg-shade-four-color)] text-center flex flex-col items-center justify-center">
					<i>
						{user?.isProfessor()
							? t('dashboard.recents.empty.professor')
							: t('dashboard.recents.empty.student')}
					</i>
					<div className="flex flex-row">
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
						{user?.isProfessor() && (
							<Button
								className="!text-xs mt-2 ml-4"
								variant="primary"
								onClick={() => setOpenFormCreateCourse(true)}
							>
								{t('dashboard.courses.add')}
							</Button>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default DashboardRecents;
