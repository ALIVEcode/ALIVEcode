import { StyledDashboardRecent } from './dashboardRecentTypes';
import { useContext } from 'react';
import { DashboardContext } from '../../../state/contexts/DashboardContext';
import CourseContainer from '../../UtilsComponents/CourseContainer/CourseContainer';

export const DashboardRecents = () => {
	const { getCourses } = useContext(DashboardContext);

	return (
		<StyledDashboardRecent className="h-100">
			<div className="p-4 h-3/5">
				<div className="h-full w-full">
					<div className="h-100 section-recents">
						<div className="section-title">Formations Récentes</div>
						<div className="underline"></div>
						<CourseContainer courses={getCourses()}></CourseContainer>
					</div>
				</div>
			</div>
			<div className="p-4 h-2/5">
				<div className="h-full w-full flex flex-row">
					<div className="h-100 w-1/2 section-levels">
						<div className="section-title">Mes niveaux</div>
						<div className="underline"></div>
					</div>
					<div className="h-100 w-1/2 section-notifs">
						<div className="section-title">Notifications</div>
						<div className="underline"></div>
					</div>
				</div>
			</div>
		</StyledDashboardRecent>
	);
};

export default DashboardRecents;