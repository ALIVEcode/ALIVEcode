import Form from '../../../UtilsComponents/Form/Form';
import { useAlert } from 'react-alert';
import { IoTObjectCreateProps } from './iotObjectCreateProps';
import { FORM_ACTION } from '../../../UtilsComponents/Form/formTypes';

/**
 * Form that creates in the database an IoTObject and returns it
 *
 * @author Enric Soldevila
 */
const IoTObjectCreate = ({ onSubmit }: IoTObjectCreateProps) => {
	const alert = useAlert();

	return (
		<Form
			onSubmit={res => {
				onSubmit && onSubmit(res);
				return alert.success('Objet connecté créé avec succès');
			}}
			name="iot_object"
			url="iot/objects"
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
					required: false,
					inputType: 'textarea',
					maxLength: 500,
				},
			]}
		/>
	);
};

export default IoTObjectCreate;
