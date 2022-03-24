import Link from '../../../Components/UtilsComponents/Link/Link';

import VoitureGIF from '../../../assets/images/Voiture.gif';
import useRoutes from '../../../state/hooks/useRoutes';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

/**
 * Page that is displayed when the requested url doesn't lead to anywhere
 *
 * @author Enric Soldevila
 */
export const NotFound = () => {
	const navigate = useNavigate();
	const { routes } = useRoutes();
	const { t } = useTranslation();

	return (
		<div className="w-full h-full flex flex-col text-center justify-center items-center">
			<div className="text-lg laptop:text-2xl desktop:text-3xl">
				{t('error.sorry')}
			</div>
			<div className="text-base laptop:text-xl desktop:text-2xl">
				{t('error.page404')}
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
