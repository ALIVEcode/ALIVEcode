import { iotDashboardProps } from './iotDashboardTypes';
import { useEffect, useState, useContext } from 'react';
import api from '../../../Models/api';
import { IoTProject } from '../../../Models/Iot/IoTproject.entity';
import useRoutes from '../../../state/hooks/useRoutes';
import styled from 'styled-components';
import FillContainer from '../../../Components/UtilsComponents/FillContainer/FillContainer';
import CardContainer from '../../../Components/UtilsComponents/CardContainer/CardContainer';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router';
import { IoTObject } from '../../../Models/Iot/IoTobject.entity';
import IoTObjectCreate from '../../../Components/IoTComponents/IoTObject/IotObjectForm/IoTObjectCreate';
import FormModal from '../../../Components/UtilsComponents/FormModal/FormModal';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../../state/contexts/UserContext';
import IoTObjectLargeCard from '../../../Components/IoTComponents/IoTObject/IoTObjectLargeCard/IoTObjectLargeCard';
import Card from '../../../Components/UtilsComponents/Cards/Card/Card';

const StyledDiv = styled(FillContainer)`
	padding: 2vw;
`;

/**
 * IoT dashboard page that contains all the projects, objects and stuff of the user
 *
 * @author MoSk3
 */
const IoTDashboard = (props: iotDashboardProps) => {
	const { user } = useContext(UserContext);
	const [projects, setProjects] = useState<IoTProject[]>();
	const [objects, setObjects] = useState<IoTObject[]>();
	const { routes } = useRoutes();
	const { t } = useTranslation();
	const history = useHistory();
	// TODO: ADD MODAL FORM GENERIC
	const [openObjectCreate, setOpenObjectCreate] = useState(false);

	useEffect(() => {
		const getProjects = async () => {
			if (!user) return;
			const projects = await api.db.users.iot.getProjects({});
			const objects = await api.db.users.iot.getObjects({});
			setProjects(projects);
			setObjects(objects);
		};
		getProjects();
	}, [user]);

	return (
		<StyledDiv>
			<div>
				<h1>IoT Dashboard</h1>
			</div>
			<div>
				<CardContainer
					asRow
					icon={faPlus}
					onIconClick={() => history.push(routes.auth.create_iot_project.path)}
					height="200px"
					className="iot-container"
					title="My projects"
				>
					{projects && projects.length > 0 ? (
						projects.map((p, idx) => (
							<Card
								key={idx}
								title={p.name}
								to={routes.auth.iot_project.path.replace(':id', p.id)}
							/>
						))
					) : (
						<div>Aucun projet</div>
					)}
				</CardContainer>
				<CardContainer
					asRow
					icon={faPlus}
					onIconClick={() => setOpenObjectCreate(!openObjectCreate)}
					height="200px"
					className="iot-container"
					title="My connected objects"
				>
					{objects && objects.length > 0 ? (
						objects.map((obj, idx) => (
							<IoTObjectLargeCard
								onUpdate={(iotObject: IoTObject) => {
									setObjects(
										objects.map(o => (o.id === iotObject.id ? iotObject : o)),
									);
									//forceUpdate();
								}}
								key={idx}
								object={obj}
							/>
						))
					) : (
						<div>Aucun objet connecté</div>
					)}
				</CardContainer>
			</div>
			<FormModal
				onSubmit={res => {
					if (!objects) return;
					const newObject: IoTObject = res.data;
					setObjects([...objects, newObject]);
					setOpenObjectCreate(false);
				}}
				onClose={() => setOpenObjectCreate(false)}
				title={t('form.title.create_iot_project')}
				open={openObjectCreate}
				closeButton={false}
				buttonVariant="primary"
			>
				<IoTObjectCreate />
			</FormModal>
		</StyledDiv>
	);
};

export default IoTDashboard;