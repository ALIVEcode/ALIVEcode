import FillContainer from '../../../Components/UtilsComponents/FillContainer/FillContainer';
import Card from '../../../Components/UtilsComponents/Cards/Card/Card';
import Voiture from '../../../assets/images/Voiture.gif';
import Code from '../../../assets/images/icons/sandboxblanc.png';
import useRoutes from '../../../state/hooks/useRoutes';
import { useTranslation } from 'react-i18next';
import { StyledLevelFormMenu } from './levelFormMenuType';

/**
 * Menu to select which type of level to create
 *
 * @author MoSk3
 */
const LevelFormMenu = () => {
	const { routes } = useRoutes();
	const { t } = useTranslation();

	return (
		<FillContainer centered>
			<StyledLevelFormMenu>
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
					img={Code}
					to={routes.auth.level_create_ai.path}
					title={t('menu.level.ai')}
				/>
				<Card
					img={Code}
					to={routes.auth.level_create_iot.path}
					title={t('menu.level.iot')}
				/>
			</StyledLevelFormMenu>
		</FillContainer>
	);
};

export default LevelFormMenu;