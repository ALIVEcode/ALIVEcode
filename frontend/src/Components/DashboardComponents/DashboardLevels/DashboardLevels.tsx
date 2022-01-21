import { useContext } from 'react';
import { DashboardContext } from '../../../state/contexts/DashboardContext';
import Button from '../../UtilsComponents/Buttons/Button';
import useRoutes from '../../../state/hooks/useRoutes';
import LevelCard from '../../LevelComponents/LevelCard/LevelCard';
import BrowsingMenu from '../../MainComponents/BrowsingMenu/BrowsingMenu';
import { Level } from '../../../Models/Level/level.entity';
import api from '../../../Models/api';
import LevelList from '../../../Pages/Level/LevelList/LevelList';

export const DashboardLevels = () => {
	const { getLevels } = useContext(DashboardContext);
	const { routes } = useRoutes();

	return (
		<div className="h-full">
			<div className="section-title">Niveaux</div>
			<div className="border-b w-1/3 border-[color:var(--bg-shade-four-color)]"></div>
			<div className="flex justify-center pt-8 pb-5">
				<Button variant="primary" to={routes.auth.level_browse.path}>
					Explorer les niveaux de la communauté
				</Button>
			</div>
			<LevelList></LevelList>
		</div>
	);
};

export default DashboardLevels;
