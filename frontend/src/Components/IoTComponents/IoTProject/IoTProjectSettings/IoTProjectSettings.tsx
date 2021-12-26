import Form from '../../../UtilsComponents/Form/Form';
import { useContext, useState } from 'react';
import { IoTProjectContext } from '../../../../state/contexts/IoTProjectContext';
import {
	IOTPROJECT_ACCESS,
	IOTPROJECT_INTERACT_RIGHTS,
} from '../../../../Models/Iot/IoTproject.entity';
import { FORM_ACTION } from '../../../UtilsComponents/Form/formTypes';
import Button from '../../../UtilsComponents/Button/Button';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import AlertConfirm from '../../../UtilsComponents/Alert/AlertConfirm/AlertConfirm';
import api from '../../../../Models/api';
import useRoutes from '../../../../state/hooks/useRoutes';
import { useAlert } from 'react-alert';
import { useTranslation } from 'react-i18next';

export const IoTProjectSettings = () => {
	const { project, canEdit, updateProjectData } = useContext(IoTProjectContext);
	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
	const { routes, goTo } = useRoutes();
	const alert = useAlert();
	const { t } = useTranslation();

	if (!project) return <></>;

	return (
		<>
			<div className="project-details-content-header">Settings</div>
			<Form
				onSubmit={res => {
					const { name, desc, access, interactRights } = res.data;
					updateProjectData(name, desc, access, interactRights);
				}}
				disabled={!canEdit}
				action={FORM_ACTION.PATCH}
				name="iot_project"
				url={`iot/projects/${project.id}`}
				inputGroups={[
					{
						name: 'name',
						required: true,
						default: project.name,
						inputType: 'text',
					},
					{
						name: 'description',
						required: false,
						default: project.description,
						inputType: 'text',
					},
					{
						name: 'access',
						required: true,
						inputType: 'select',
						default: project.access,
						selectOptions: IOTPROJECT_ACCESS,
					},
					{
						name: 'interactRights',
						required: true,
						default: project.interactRights,
						inputType: 'select',
						selectOptions: IOTPROJECT_INTERACT_RIGHTS,
					},
				]}
			/>
			<Button
				onClick={() => setConfirmDeleteOpen(true)}
				className="mt-5"
				variant="danger"
				icon={faTrash}
			>
				{t('form.submit.DELETE', { name: t('iot.project.name') })}
			</Button>
			<AlertConfirm
				title={t('form.submit.DELETE', { name: t('iot.project.name') })}
				open={confirmDeleteOpen}
				onClose={() => setConfirmDeleteOpen(false)}
				onConfirm={async () => {
					await api.db.iot.projects.delete({ id: project.id });
					goTo(routes.auth.iot_dashboard.path);
					alert.success('Iot Project Deleted');
				}}
			/>
		</>
	);
};

export default IoTProjectSettings;