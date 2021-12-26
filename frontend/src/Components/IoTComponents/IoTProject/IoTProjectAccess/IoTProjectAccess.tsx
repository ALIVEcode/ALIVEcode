import IconButton from '../../../DashboardComponents/IconButton/IconButton';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useContext } from 'react';
import { IoTObjectCard } from '../../IoTObject/IoTObjectCard/IoTObjectCard';
import LoadingScreen from '../../../UtilsComponents/LoadingScreen/LoadingScreen';
import { plainToClass } from 'class-transformer';
import FormModal from '../../../UtilsComponents/FormModal/FormModal';
import Form from '../../../UtilsComponents/Form/Form';
import { IoTObject } from '../../../../Models/Iot/IoTobject.entity';
import Modal from '../../../UtilsComponents/Modal/Modal';
import { IoTProjectContext } from '../../../../state/contexts/IoTProjectContext';
import api from '../../../../Models/api';
import { FORM_ACTION } from '../../../UtilsComponents/Form/formTypes';

export const IoTProjectAccess = () => {
	const [addObjectModalOpen, setAddObjectModalOpen] = useState(false);
	const { project, canEdit, loadIoTObjects, addIoTObject } =
		useContext(IoTProjectContext);
	const [userIotObjects, setUserIoTObjects] = useState<IoTObject[]>();

	useEffect(() => {
		if (!project) return;

		// Load project objects
		if (!project.iotObjects) loadIoTObjects();

		if (!canEdit) return;

		// Load user objects
		const loadUserIoTObjects = async () => {
			setUserIoTObjects(await api.db.users.iot.getObjects({}));
		};
		loadUserIoTObjects();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!project) return <></>;

	const iotObjectOptions = userIotObjects?.flatMap(obj => {
		if (project.iotObjects?.find(o => o.id === obj.id)) return [];
		return {
			value: obj.id,
			display: obj.name,
		};
	});

	return (
		<>
			<div className="project-details-content-header">Access</div>
			<h6>
				IoTObjects{' '}
				{canEdit && (
					<IconButton
						onClick={() => setAddObjectModalOpen(true)}
						icon={faPlus}
					/>
				)}
			</h6>
			{project.iotObjects ? (
				project.iotObjects.length > 0 ? (
					project.iotObjects.map((obj, idx) => (
						<IoTObjectCard key={idx} object={obj} />
					))
				) : (
					'No IoTObjects'
				)
			) : (
				<LoadingScreen relative />
			)}

			{iotObjectOptions?.length === 0 ? (
				<Modal
					title="Add an IoTObject to the project"
					open={addObjectModalOpen}
					onClose={() => setAddObjectModalOpen(false)}
				>
					You have no IoTObject to add to the project
				</Modal>
			) : (
				<FormModal
					onSubmit={res => {
						addIoTObject(plainToClass(IoTObject, res.data));
						setAddObjectModalOpen(false);
					}}
					title="Add an IoTObject to the project"
					open={addObjectModalOpen}
					onClose={() => setAddObjectModalOpen(false)}
				>
					<Form
						action={FORM_ACTION.POST}
						name="iot_project_object"
						url={`iot/projects/${project.id}/objects`}
						inputGroups={[
							{
								name: 'id',
								required: true,
								default: project.name,
								inputType: 'select',
								selectOptions: iotObjectOptions,
							},
						]}
					/>
				</FormModal>
			)}
		</>
	);
};

export default IoTProjectAccess;