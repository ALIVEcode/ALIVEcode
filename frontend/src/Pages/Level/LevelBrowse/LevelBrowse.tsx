import {
	ChallengeBrowseProps,
	StyledChallengeBrowse,
} from './levelBrowseTypes';
import { useState } from 'react';
import { Challenge } from '../../../Models/Level/challenge.entity';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import ChallengeCard from '../../../Components/LevelComponents/LevelCard/LevelCard';
import BrowsingMenu from '../../../Components/MainComponents/BrowsingMenu/BrowsingMenu';
import { BrowsingResults } from '../../../Components/MainComponents/BrowsingMenu/browsingMenuTypes';
import api from '../../../Models/api';
import { useTranslation } from 'react-i18next';

/**
 * Browsing menu that shows all the levels sorted with a query
 *
 * @author Enric Soldevila
 */
const LevelBrowse = (props: ChallengeBrowseProps) => {
	const [browsingResult, setBrowsingResult] =
		useState<BrowsingResults<Challenge>>();
	const levels = browsingResult?.results;

	const { t } = useTranslation();

	return (
		<div className="p-4 relative">
			<div className="text-3xl mb-4">{t('msg.community_levels')}</div>
			<StyledChallengeBrowse>
				<BrowsingMenu<Challenge>
					fetchOnSubmit
					apiRequest={api.db.challenges.query}
					onChange={res => setBrowsingResult(res)}
				/>
				<div className="levels">
					{!levels ? (
						<LoadingScreen relative />
					) : (
						<>
							{levels.map((l, idx) => (
								<ChallengeCard challenge={l} key={idx} />
							))}
						</>
					)}
				</div>
			</StyledChallengeBrowse>
		</div>
	);
};

export default LevelBrowse;
