import Button from '../../UtilsComponents/Buttons/Button';
import useRoutes from '../../../state/hooks/useRoutes';
import ChallengeList from '../../../Pages/Challenge/ChallengeList/ChallengeList';
import { useTranslation } from 'react-i18next';
import Info from '../../HelpComponents';

export const DashboardChallenges = () => {
	const { routes } = useRoutes();
	const { t } = useTranslation();

	return (
		<div className="h-full p-4">
			<div className="section-title flex flex-row justify-between w-1/3">
				{t('dashboard.challenges.title')}
				<Info.Icon
					hoverPopup={{
						position: 'right center',
					}}
				>
					<Info.Box
						useDefaultStyle
						text={t('help.dashboard.views.challenges')}
					/>
				</Info.Icon>
			</div>
			<div className="border-b w-1/3 border-[color:var(--bg-shade-four-color)]" />
			<div className="flex items-center justify-center pt-8 pb-5 flex-col laptop:flex-row gap-4 laptop:gap-8">
				<Button
					className="w-full tablet:w-[20rem]"
					variant="primary"
					to={routes.auth.challenge_browse.path}
				>
					{t('dashboard.challenges.browse_challenges')}
				</Button>
				<Button
					className="w-full tablet:w-[20rem]"
					variant="secondary"
					to={routes.auth.challenge_create.path}
				>
					{t('dashboard.challenges.create_challenge')}
				</Button>
			</div>
			<ChallengeList />
		</div>
	);
};

export default DashboardChallenges;
