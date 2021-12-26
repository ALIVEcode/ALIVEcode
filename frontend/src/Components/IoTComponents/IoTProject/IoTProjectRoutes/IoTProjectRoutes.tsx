import IconButton from '../../../DashboardComponents/IconButton/IconButton';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import IoTRouteCard from '../../IoTRoute/IoTRouteCard/IoTRouteCard';
import FormModal from '../../../UtilsComponents/FormModal/FormModal';
import { useState, useContext } from 'react';
import { IoTprojectAddRouteForm } from '../IoTProjectAddRouteForm/IoTProjectAddRouteForm';
import { IoTProjectContext } from '../../../../state/contexts/IoTProjectContext';
import { plainToClass } from 'class-transformer';
import { IotRoute } from '../../../../Models/Iot/IoTroute.entity';

export const IoTProjectRoutes = () => {
	const [routeModalOpen, setRouteModalOpen] = useState(false);
	const { project, canEdit, addRoute } = useContext(IoTProjectContext);

	if (!project) return <></>;

	return (
		<>
			<div className="project-details-content-header">
				<label className="mr-2">Routes</label>
				{canEdit && (
					<IconButton icon={faPlus} onClick={() => setRouteModalOpen(true)} />
				)}
			</div>
			<div>
				{project.routes.length > 0 ? (
					project.routes.map((r, idx) => <IoTRouteCard key={idx} route={r} />)
				) : (
					<label className="disabled-text">No route</label>
				)}
			</div>
			<FormModal
				title="New route"
				onSubmit={res => {
					addRoute(plainToClass(IotRoute, res.data));
					setRouteModalOpen(false);
				}}
				onClose={() => setRouteModalOpen(false)}
				open={routeModalOpen}
			>
				<IoTprojectAddRouteForm project={project} />
			</FormModal>
		</>
	);
};

export default IoTProjectRoutes;