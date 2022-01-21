import { useContext } from 'react';
import { DashboardContext } from '../../../state/contexts/DashboardContext';
import CourseContainer from '../../UtilsComponents/CourseContainer/CourseContainer';
import { useTranslation } from 'react-i18next';

export const DashboardRecents = () => {
	const { getCourses } = useContext(DashboardContext);
	const { t } = useTranslation();

	return (
		<div className="h-full p-4">
			<div className="section-title">{t('dashboard.recents.title')}</div>
			<div className="border-b w-1/3 border-[color:var(--bg-shade-four-color)]"></div>
			<div>
				<CourseContainer courses={getCourses()}></CourseContainer>
			</div>
		</div>
	);
};

export default DashboardRecents;
