import Card from '../../../Components/UtilsComponents/Cards/Card/Card';
import Voiture from '../../../assets/images/Voiture.gif';
import Brain from '../../../assets/images/ai/IA.png';
import IoT from '../../../assets/images/iot/demo_project.png';
import Code from '../../../assets/images/icons/sandboxblanc.png';
import useRoutes from '../../../state/hooks/useRoutes';
import { useTranslation } from 'react-i18next';

/**
 * Menu to select which type of challenge to create
 *
 * @author Enric Soldevila
 */
const ChallengeFormMenu = () => {
	const { routes } = useRoutes();
	const { t } = useTranslation();

	return (
		<div className="w-full h-full items-center justify-items-center grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4">
			<Card
				img={Voiture}
				to={routes.auth.challenge_create_alive.path}
				title={t('menu.challenge.alive')}
			/>
			<Card
				img={Code}
				to={routes.auth.challenge_create_code.path}
				title={t('menu.challenge.code')}
			/>
			<Card
				img={Brain}
				to={routes.auth.challenge_create_ai.path}
				title={t('menu.challenge.ai')}
			/>
			<Card
				img={IoT}
				to={routes.auth.challenge_create_iot.path}
				title={t('menu.challenge.iot')}
			/>
		</div>
	);
};

export default ChallengeFormMenu;
