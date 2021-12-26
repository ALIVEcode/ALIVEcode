import { IoTProject } from "../../../../Models/Iot/IoTproject.entity";
import Form from '../../../UtilsComponents/Form/Form';
import { FORM_ACTION } from '../../../UtilsComponents/Form/formTypes';

export const IoTprojectAddRouteForm = ({
	project,
	onSubmit,
}: {
	project: IoTProject;
	onSubmit?: (data: any) => void;
}) => {
	return (
		<Form
			action={FORM_ACTION.POST}
			name="create_iot_route"
			onSubmit={onSubmit}
			url={`iot/projects/${project.id}/routes`}
			inputGroups={[
				{
					name: 'name',
					required: true,
					inputType: 'text',
					minLength: 2,
					maxLength: 100,
				},
				{
					name: 'path',
					required: true,
					inputType: 'text',
					minLength: 2,
					maxLength: 50,
				},
			]}
		/>
	);
};