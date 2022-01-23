import { useState, useContext } from 'react';
import { Level } from '../../../Models/Level/level.entity';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import LevelCard from '../../../Components/LevelComponents/LevelCard/LevelCard';
import BrowsingMenu from '../../../Components/MainComponents/BrowsingMenu/BrowsingMenu';
import { BrowsingResults } from '../../../Components/MainComponents/BrowsingMenu/browsingMenuTypes';
import api from '../../../Models/api';
import { UserContext } from '../../../state/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import {
	LevelBrowseProps,
	StyledLevelBrowse,
} from '../LevelBrowse/levelBrowseTypes';
import Button from '../../../Components/UtilsComponents/Buttons/Button';
import useRoutes from '../../../state/hooks/useRoutes';
import { useTranslation } from 'react-i18next';

/**
 * Browsing menu that shows all the levels of the current user sorted with a query
 *
 * @author MoSk3
 */
const LevelList = (props: LevelBrowseProps) => {
	const [browsingResult, setBrowsingResult] =
		useState<BrowsingResults<Level>>();
	const levels = browsingResult?.results;
	const { user } = useContext(UserContext);
	const { routes } = useRoutes();
	const { t } = useTranslation();
	const navigate = useNavigate();

	if (!user) {
		navigate('/');
		return <></>;
	}

	return (
		<StyledLevelBrowse>
			<BrowsingMenu<Level>
				fetchOnSubmit
				apiRequest={query =>
					api.db.users.getLevels(
						{ id: user.id },
						query.txt ? { search: query.txt } : undefined,
					)
				}
				onChange={res => setBrowsingResult(res)}
			/>
			<div className="levels">
				{!levels ? (
					<LoadingScreen relative />
				) : (
					<>
						{levels.length > 0 ? (
							levels.map((l, idx) => <LevelCard level={l} key={idx} />)
						) : (
							<div className="w-full h-full">
								<div className="text-[color:var(--fg-shade-four-color)] flex flex-col items-center justify-center">
									<i>{t('dashboard.levels.empty')}</i>
									<Button
										className="!text-xs mt-2"
										variant="primary"
										to={routes.auth.level_create.path}
									>
										{t('dashboard.levels.create_level')}
									</Button>
								</div>
							</div>
						)}
					</>
				)}
			</div>
		</StyledLevelBrowse>
	);
};

export default LevelList;
