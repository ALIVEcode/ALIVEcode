import FormContainer from '../../../UtilsComponents/FormContainer/FormContainer';
import { useTranslation } from 'react-i18next';
import Form from '../../../UtilsComponents/Form/Form';
import { useNavigate } from 'react-router';
import useRoutes from '../../../../state/hooks/useRoutes';
import { useAlert } from 'react-alert';
import { IoTProject } from '../../../../Models/Iot/IoTproject.entity';
import {
	IOTPROJECT_ACCESS,
	IOTPROJECT_INTERACT_RIGHTS,
} from '../../../../Models/Iot/IoTproject.entity';
import { FORM_ACTION } from '../../../UtilsComponents/Form/formTypes';

/**
 * Form that creates in the database an IoTProject and navigates to it
 *
 * @author Enric Soldevila
 */
const IoTProjectCreate = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { routes } = useRoutes();
	const alert = useAlert();

	return (
		<FormContainer title={t('form.title.create_iot_project')}>
			<Form
				onSubmit={res => {
					const project: IoTProject = res.data;
					navigate(routes.auth.iot_project.path.replace(':id', project.id));
					return alert.success('Projet créé avec succès');
				}}
				name="iot_project"
				url="iot/projects"
				action={FORM_ACTION.POST}
				inputGroups={[
					{
						name: 'name',
						required: true,
						inputType: 'text',
						minLength: 3,
						maxLength: 100,
					},
					{
						name: 'description',
						inputType: 'textarea',
						maxLength: 500,
					},
					{
						name: 'access',
						required: true,
						inputType: 'select',
						selectOptions: IOTPROJECT_ACCESS,
						default: IOTPROJECT_ACCESS.PRIVATE,
					},
					{
						name: 'interactRights',
						required: true,
						inputType: 'select',
						selectOptions: IOTPROJECT_INTERACT_RIGHTS,
						default: IOTPROJECT_INTERACT_RIGHTS.PRIVATE,
					},
				]}
			/>
		</FormContainer>
	);
};

export default IoTProjectCreate;
