import Link from '../../../Components/UtilsComponents/Link/Link';

import VoitureGIF from '../../../assets/images/Voiture.gif';
import FillContainer from '../../../Components/UtilsComponents/FillContainer/FillContainer';
import { useHistory } from 'react-router';
import useRoutes from '../../../state/hooks/useRoutes';
import { useTranslation } from 'react-i18next';

/**
 * Page that is displayed when the requested url doesn't lead to anywhere
 *
 * @author MoSk3
 */
export const NotFound = () => {
	const history = useHistory();
	const { routes } = useRoutes();
	const { t } = useTranslation();

	return (
		<FillContainer style={{ textAlign: 'center' }} startAtTop centered>
			<div>
				<h1>{t('error.sorry')}</h1>
				<h2>{t('error.page404')}</h2>
				<img src={VoitureGIF} alt="Voiture ALIVE" />
				<div>
					<Link onClick={() => history.goBack()} dark bold>
						{t('error.back')}
					</Link>
					<br />
					<br />
					<Link to={routes.public.home.path} bold>
						{t('error.home')}
					</Link>
				</div>
			</div>
		</FillContainer>
	);
};