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
 * @author Enric Soldevila
 */
export const MaintenanceError = () => {
	const navigate = useNavigate();
	const { routes } = useRoutes();
	const { t } = useTranslation();
	const { maintenance } = useContext(UserContext);

	if (!maintenance) return <NotFound />;

	return (
		<div className="w-full h-full flex flex-col text-center justify-center items-center">
			<div className="text-lg laptop:text-2xl desktop:text-3xl">
				{t('error.sorry')}
			</div>
			<div className="text-base laptop:text-xl desktop:text-2xl">
				{t('error.maintenance.ongoing', {
					startDate: formatDate(maintenance.startDate, t),
					finishDate: formatDate(maintenance.finishDate, t),
				})}
			</div>
			<img
				className="w-2/3 tablet:w-1/3 laptop:w-1/4"
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
	);
};
