import { MaintenanceBarProps, StyledMaintenanceBar } from './maintenanceBarTypes';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Link from '../../UtilsComponents/Link/Link';
import useRoutes from '../../../state/hooks/useRoutes';
import { formatDate } from '../../../Types/formatting';

/**
 * Maintenance alert box at the bottom of the screen that appears when a maintenance is coming soon or ongoing.
 *
 * @param {Mainteannce} maintenance maintenance object;
 * @param {() => void} onClose callback called when the maintenance box is closed
 *
 * @author MoSk3
 */
const MaintenanceBar = ({ maintenance, onClose }: MaintenanceBarProps) => {
	const { t } = useTranslation();
	const { routes } = useRoutes();

	const formattedOptions = {
		startDate: formatDate(maintenance.startDate, t),
		finishDate: formatDate(maintenance.finishDate, t),
	};

	return (
		<StyledMaintenanceBar>
			<label className="maintenance-info">
				{!maintenance.started
					? t('msg.maintenance.upcoming', formattedOptions)
					: t('msg.maintenance.ongoing', formattedOptions)}{' '}
				<Link dark to={routes.public.maintenances.path}>
					{t('msg.maintenance.more_info')}
				</Link>
			</label>
			<label className="maintenance-title">{maintenance.name}</label>
			<FontAwesomeIcon
				className="close-icon"
				size="lg"
				icon={faTimes}
				onClick={onClose}
			></FontAwesomeIcon>
		</StyledMaintenanceBar>
	);
};

export default MaintenanceBar;
