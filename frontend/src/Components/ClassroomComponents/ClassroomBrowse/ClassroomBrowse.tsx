import { useState } from 'react';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import BrowsingMenu from '../../MainComponents/BrowsingMenu/BrowsingMenu';
import { BrowsingResults } from '../../MainComponents/BrowsingMenu/browsingMenuTypes';
import api from '../../../Models/api';
import { useTranslation } from 'react-i18next';
import { StyledLevelBrowse } from '../../../Pages/Level/LevelBrowse/levelBrowseTypes';
import { Classroom } from '../../../Models/Classroom/classroom.entity';
import ClassroomCard from '../../DashboardComponents/ClassroomCard/ClassroomCard';

/**
 * Browsing menu that shows all the levels sorted with a query
 *
 * @author MoSk3
 */
const ClassroomBrowse = () => {
	const [browsingResult, setBrowsingResult] =
		useState<BrowsingResults<Classroom>>();
	const classrooms = browsingResult?.results;

	const { t } = useTranslation();

	return (
		<div className="p-4 relative">
			<div className="text-3xl mb-4">{t('msg.public_classrooms')}</div>
			<StyledLevelBrowse>
				<BrowsingMenu<Classroom>
					fetchOnSubmit
					apiRequest={api.db.classrooms.query}
					onChange={res => setBrowsingResult(res)}
				/>
				<div className="levels">
					{!classrooms ? (
						<LoadingScreen relative />
					) : (
						<>
							{classrooms.map((c, idx) => (
								<ClassroomCard classroom={c} key={idx} />
							))}
						</>
					)}
				</div>
			</StyledLevelBrowse>
		</div>
	);
};

export default ClassroomBrowse;
