import {
	ChallengeBrowseProps,
	StyledChallengeBrowse,
} from './challengeBrowseTypes';
import { useState } from 'react';
import { Challenge } from '../../../Models/Challenge/challenge.entity';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import BrowsingMenu from '../../../Components/MainComponents/BrowsingMenu/BrowsingMenu';
import { BrowsingResults } from '../../../Components/MainComponents/BrowsingMenu/browsingMenuTypes';
import api from '../../../Models/api';
import { useTranslation } from 'react-i18next';
import ChallengeCard from '../../../Components/ChallengeComponents/ChallengeCard/ChallengeCard';

/**
 * Browsing menu that shows all the challenges sorted with a query
 *
 * @author Enric Soldevila
 */
const ChallengeBrowse = (props: ChallengeBrowseProps) => {
	const [browsingResult, setBrowsingResult] =
		useState<BrowsingResults<Challenge>>();
	const challenges = browsingResult?.results;

	const { t } = useTranslation();

	return (
		<div className="p-4 relative">
			<div className="text-3xl mb-4">{t('msg.community_challenges')}</div>
			<StyledChallengeBrowse>
				<BrowsingMenu<Challenge>
					fetchOnSubmit
					apiRequest={api.db.challenges.query}
					onChange={res => setBrowsingResult(res)}
				/>
				<div className="challenges">
					{!challenges ? (
						<LoadingScreen relative />
					) : (
						<>
							{challenges.map((l, idx) => (
								<ChallengeCard challenge={l} key={idx} />
							))}
						</>
					)}
				</div>
			</StyledChallengeBrowse>
		</div>
	);
};

export default ChallengeBrowse;
