import Link from '../../../Components/UtilsComponents/Link/Link';

import VoitureGIF from '../../../assets/images/Voiture.gif';
import FillContainer from '../../../Components/UtilsComponents/FillContainer/FillContainer';
import useRoutes from '../../../state/hooks/useRoutes';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

/**
 * Page that is displayed when the requested url doesn't lead to anywhere
 *
 * @author MoSk3
 */
export const NotFound = () => {
	const navigate = useNavigate();
	const { routes } = useRoutes();
	const { t } = useTranslation();

	return (
		<FillContainer style={{ textAlign: 'center' }} centered>
			<div>
				<h1>{t('error.sorry')}</h1>
				<h2>{t('error.page404')}</h2>
				<img
					style={{ width: '20%', height: '20%' }}
					src={VoitureGIF}
					alt="Voiture ALIVE"
				/>
				<div>
					<Link onClick={() => navigate(-1)} dark bold>
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