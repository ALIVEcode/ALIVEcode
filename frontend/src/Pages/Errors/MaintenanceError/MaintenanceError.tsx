import Link from '../../../Components/UtilsComponents/Link/Link';

import VoitureGIF from '../../../assets/images/Voiture.gif';
import FillContainer from '../../../Components/UtilsComponents/FillContainer/FillContainer';
import useRoutes from '../../../state/hooks/useRoutes';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { UserContext } from '../../../state/contexts/UserContext';
import { formatDate } from '../../../Types/formatting';
import { NotFound } from '../NotFound/NotFound';
import { useNavigate } from 'react-router-dom';

/**
 * Page that is displayed when the requested url cannot be reach due to maintenance
 *
 * @author MoSk3
 */
export const MaintenanceError = () => {
	const navigate = useNavigate();
	const { routes } = useRoutes();
	const { t } = useTranslation();
	const { maintenance } = useContext(UserContext);

	if (!maintenance) return <NotFound />;

	return (
		<FillContainer style={{ textAlign: 'center' }} startAtTop centered>
			<div>
				<h1>{t('error.sorry')}</h1>
				<h2>
					{t('error.maintenance.ongoing', {
						startDate: formatDate(maintenance.startDate, t),
						finishDate: formatDate(maintenance.finishDate, t),
					})}
				</h2>
				<img src={VoitureGIF} alt="Voiture ALIVE" />
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