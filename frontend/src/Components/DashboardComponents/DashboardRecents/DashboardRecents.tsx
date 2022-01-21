import { useContext } from 'react';
import { DashboardContext } from '../../../state/contexts/DashboardContext';
import CourseContainer from '../../UtilsComponents/CourseContainer/CourseContainer';

export const DashboardRecents = () => {
	const { getCourses } = useContext(DashboardContext);

	return (
		<div className="h-full">
			<div className="section-title">Formations Récentes</div>
			<div className="border-b w-1/3 border-[color:var(--bg-shade-four-color)]"></div>
			<div>
				<CourseContainer courses={getCourses()}></CourseContainer>
			</div>
		</div>
	);
};

export default DashboardRecents;
