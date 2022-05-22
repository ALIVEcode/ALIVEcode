import { useState, useContext } from 'react';
import { Challenge } from '../../../Models/Challenge/challenge.entity';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import BrowsingMenu from '../../../Components/MainComponents/BrowsingMenu/BrowsingMenu';
import { BrowsingResults } from '../../../Components/MainComponents/BrowsingMenu/browsingMenuTypes';
import api from '../../../Models/api';
import { UserContext } from '../../../state/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import {
	ChallengeBrowseProps,
	StyledChallengeBrowse,
} from '../ChallengeBrowse/challengeBrowseTypes';
import Button from '../../../Components/UtilsComponents/Buttons/Button';
import useRoutes from '../../../state/hooks/useRoutes';
import { useTranslation } from 'react-i18next';
import ChallengeCard from '../../../Components/ChallengeComponents/ChallengeCard/ChallengeCard';

/**
 * Browsing menu that shows all the challenges of the current user sorted with a query
 *
 * @author Enric Soldevila
 */
const ChallengeList = (props: ChallengeBrowseProps) => {
	const [browsingResult, setBrowsingResult] =
		useState<BrowsingResults<Challenge>>();
	const challenges = browsingResult?.results;
	const { user } = useContext(UserContext);
	const { routes } = useRoutes();
	const { t } = useTranslation();
	const navigate = useNavigate();

	if (!user) {
		navigate('/');
		return <></>;
	}

	return (
		<StyledChallengeBrowse>
			<BrowsingMenu<Challenge>
				fetchOnSubmit
				apiRequest={query =>
					api.db.users.getChallenges(
						{ id: user.id },
						query.txt ? { search: query.txt } : undefined,
					)
				}
				onChange={res => setBrowsingResult(res)}
			/>
			<div className="challenges">
				{!challenges ? (
					<LoadingScreen relative />
				) : (
					<>
						{challenges.length > 0 ? (
							challenges.map((l, idx) => (
								<ChallengeCard challenge={l} key={idx} />
							))
						) : (
							<div className="w-full h-full">
								<div className="text-[color:var(--fg-shade-four-color)] flex flex-col items-center justify-center">
									<i>{t('dashboard.challenges.empty')}</i>
									<Button
										className="!text-xs mt-2"
										variant="primary"
										to={routes.auth.challenge_create.path}
									>
										{t('dashboard.challenges.create_challenge')}
									</Button>
								</div>
							</div>
						)}
					</>
				)}
			</div>
		</StyledChallengeBrowse>
	);
};

export default ChallengeList;
