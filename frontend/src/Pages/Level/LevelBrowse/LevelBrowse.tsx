import { LevelBrowseProps, StyledLevelBrowse } from './levelBrowseTypes';
import { useState } from 'react';
import { Level } from '../../../Models/Level/level.entity';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import LevelCard from '../../../Components/LevelComponents/LevelCard/LevelCard';
import BrowsingMenu from '../../../Components/MainComponents/BrowsingMenu/BrowsingMenu';
import { BrowsingResults } from '../../../Components/MainComponents/BrowsingMenu/browsingMenuTypes';
import api from '../../../Models/api';
import { useTranslation } from 'react-i18next';

/**
 * Browsing menu that shows all the levels sorted with a query
 *
 * @author MoSk3
 */
const LevelBrowse = (props: LevelBrowseProps) => {
	const [browsingResult, setBrowsingResult] =
		useState<BrowsingResults<Level>>();
	const levels = browsingResult?.results;

	const { t } = useTranslation();

	return (
		<div className="p-4 relative">
			<div className="text-3xl mb-4">{t('msg.community_levels')}</div>
			<StyledLevelBrowse>
				<BrowsingMenu<Level>
					fetchOnSubmit
					apiRequest={api.db.levels.query}
					onChange={res => setBrowsingResult(res)}
				/>
				<div className="levels">
					{!levels ? (
						<LoadingScreen relative />
					) : (
						<>
							{levels.map((l, idx) => (
								<LevelCard level={l} key={idx} />
							))}
						</>
					)}
				</div>
			</StyledLevelBrowse>
		</div>
	);
};

export default LevelBrowse;
