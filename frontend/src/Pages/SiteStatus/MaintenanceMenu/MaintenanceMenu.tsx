import { StyledMaintenanceMenu } from './maintenanceMenuTypes';
import { useEffect, useState } from 'react';
import api from '../../../Models/api';
import { Maintenance } from '../../../Models/Maintenance/maintenance.entity';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import MaintenanceCard from '../../../Components/SiteStatusComponents/MaintenanceCard/MaintenanceCard';

/**
 * Page displaying all the historic of the maintenances
 *
 * @author MoSk3
 */
const MaintenanceMenu = () => {
	const [maintenances, setMaintenances] = useState<Maintenance[]>();

	useEffect(() => {
		const getMaintenances = async () => {
			const maintenances = await api.db.maintenances.getMaintenances();
			setMaintenances(maintenances);
		};
		getMaintenances();
	}, []);

	return (
		<StyledMaintenanceMenu>
			<h1 className="title">Maintenances</h1>
			{!maintenances ? (
				<LoadingScreen />
			) : (
				maintenances.map((m, idx) => (
					<MaintenanceCard key={idx} maintenance={m} />
				))
			)}
		</StyledMaintenanceMenu>
	);
};

export default MaintenanceMenu;