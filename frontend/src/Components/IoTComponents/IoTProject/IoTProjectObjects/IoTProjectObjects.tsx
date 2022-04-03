import IconButton from '../../../DashboardComponents/IconButton/IconButton';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useContext } from 'react';
import LoadingScreen from '../../../UtilsComponents/LoadingScreen/LoadingScreen';
import { plainToClass } from 'class-transformer';
import FormModal from '../../../UtilsComponents/FormModal/FormModal';
import Form from '../../../UtilsComponents/Form/Form';
import { IoTObject } from '../../../../Models/Iot/IoTobject.entity';
import Modal from '../../../UtilsComponents/Modal/Modal';
import { IoTProjectContext } from '../../../../state/contexts/IoTProjectContext';
import api from '../../../../Models/api';
import { FORM_ACTION } from '../../../UtilsComponents/Form/formTypes';
import { IoTProjectObject as IoTProjectObjectModel } from '../../../../Models/Iot/IoTprojectObject.entity';
import IoTProjectObject from '../../IoTObject/IoTProjectObject/IoTProjectObject';

export const IoTProjectAccess = () => {
	const [addObjectModalOpen, setAddObjectModalOpen] = useState(false);
	const { project, canEdit, loadIoTObjects, addIoTObject } =
		useContext(IoTProjectContext);
	const [userIotObjects, setUserIoTObjects] = useState<IoTObject[]>();

	useEffect(() => {
		if (!project) return;

		// Load project objects
		if (!project.iotProjectObjects) loadIoTObjects();

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
		if (project.iotProjectObjects?.find(o => o.iotObject?.id === obj.id))
			return [];
		return {
			value: obj.id,
			display: obj.name,
		};
	});

	return (
		<div className="w-full h-full overflow-y-auto">
			<h6>
				IoTObjects{' '}
				{canEdit && (
					<IconButton
						onClick={() => setAddObjectModalOpen(true)}
						icon={faPlus}
					/>
				)}
			</h6>
			{project.iotProjectObjects ? (
				project.iotProjectObjects.length > 0 ? (
					project.iotProjectObjects.map((obj, idx) => (
						<IoTProjectObject key={idx} object={obj} odd={idx % 2 !== 0} />
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
					setOpen={setAddObjectModalOpen}
				>
					You have no IoTObject to add to the project
				</Modal>
			) : (
				<FormModal
					onSubmit={res => {
						addIoTObject(plainToClass(IoTProjectObjectModel, res.data));
						setAddObjectModalOpen(false);
					}}
					title="Add an IoTObject to the project"
					open={addObjectModalOpen}
					setOpen={setAddObjectModalOpen}
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
		</div>
	);
};

export default IoTProjectAccess;
