import Form from "../../../UtilsComponents/Form/Form";
import { IOTOBJECT_LABEL } from '../../../../Models/Iot/IoTobject.entity';
import Link from '../../../UtilsComponents/Link/Link';
import { FORM_ACTION } from '../../../UtilsComponents/Form/formTypes';
import { IoTObjectSettingsProps } from './iotObjectSettingsTypes';
import useRoutes from '../../../../state/hooks/useRoutes';
import { useState } from 'react';
import { useAlert } from 'react-alert';
import { useTranslation } from 'react-i18next';
import AlertConfirm from '../../../UtilsComponents/Alert/AlertConfirm/AlertConfirm';
import Button from '../../../UtilsComponents/Button/Button';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import api from '../../../../Models/api';

const IoTObjectSettings = ({ object, onUpdate }: IoTObjectSettingsProps) => {
	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
	const { routes, goTo } = useRoutes();
	const alert = useAlert();
	const { t } = useTranslation();

	return (
		<>
			<Form
				onSubmit={res => {
					const { name, description, label } = res.data;
					object.name = name;
					object.description = description;
					object.label = label;
					onUpdate(object);
				}}
				action={FORM_ACTION.PATCH}
				name="iot object"
				url={`iot/objects/${object.id}`}
				inputGroups={[
					{
						name: 'name',
						required: true,
						default: object.name,
						inputType: 'text',
					},
					{
						name: 'description',
						required: false,
						default: object.description,
						inputType: 'text',
					},
					{
						name: 'label',
						required: true,
						default: object.label,
						inputType: 'select',
						selectOptions: IOTOBJECT_LABEL,
					},
				]}
			/>
			<Button
				onClick={() => setConfirmDeleteOpen(true)}
				className="mt-4 mb-3"
				variant="danger"
				icon={faTrash}
			>
				{t('form.submit.DELETE', { name: t('iot.object.name') })}
			</Button>
			<AlertConfirm
				title={t('form.submit.DELETE', { name: t('iot.object.name') })}
				open={confirmDeleteOpen}
				onClose={() => setConfirmDeleteOpen(false)}
				onConfirm={async () => {
					await api.db.iot.objects.delete({ id: object.id });
					goTo(routes.auth.iot_dashboard.path);
					alert.success('Iot Project Deleted');
				}}
			/>
			<br />
			&nbsp;
			<Link onClick={() => navigator.clipboard.writeText(object.id)} dark bold>
				Copy id
			</Link>
		</>
	);
};

export default IoTObjectSettings;