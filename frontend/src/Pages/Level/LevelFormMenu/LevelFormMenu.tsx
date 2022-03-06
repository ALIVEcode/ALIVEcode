import Card from '../../../Components/UtilsComponents/Cards/Card/Card';
import Voiture from '../../../assets/images/Voiture.gif';
import Brain from '../../../assets/images/ai/IA.png';
import IoT from '../../../assets/images/iot/demo_project.png';
import Code from '../../../assets/images/icons/sandboxblanc.png';
import useRoutes from '../../../state/hooks/useRoutes';
import { useTranslation } from 'react-i18next';

/**
 * Menu to select which type of level to create
 *
 * @author Enric Soldevila
 */
const LevelFormMenu = () => {
	const { routes } = useRoutes();
	const { t } = useTranslation();

	return (
		<div className="w-full h-full items-center justify-items-center grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4">
			<Card
				img={Voiture}
				to={routes.auth.level_create_alive.path}
				title={t('menu.level.alive')}
			/>
			<Card
				img={Code}
				to={routes.auth.level_create_code.path}
				title={t('menu.level.code')}
			/>
			<Card
				img={Brain}
				to={routes.auth.level_create_ai.path}
				title={t('menu.level.ai')}
			/>
			<Card
				img={IoT}
				to={routes.auth.level_create_iot.path}
				title={t('menu.level.iot')}
			/>
		</div>
	);
};

export default LevelFormMenu;
