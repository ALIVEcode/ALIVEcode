import { ClassroomFormProps } from './classroomFormTypes';
import Form from '../../UtilsComponents/Form/Form';
import FormContainer from '../../UtilsComponents/FormContainer/FormContainer';
import { useTranslation } from 'react-i18next';
import {
	CLASSROOM_SUBJECT,
	Classroom,
} from '../../../Models/Classroom/classroom.entity';
import useRoutes from '../../../state/hooks/useRoutes';
import { useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { FORM_ACTION } from '../../UtilsComponents/Form/formTypes';

/**
 * Form that creates a new classroom in the db and navigates to it
 *
 * @author MoSk3
 */
const ClassroomForm = (props: ClassroomFormProps) => {
	const { t } = useTranslation();
	const { routes } = useRoutes();
	const history = useHistory();
	const alert = useAlert();

	return (
		<FormContainer title={t('form.title.create_classroom')}>
			<Form
				onSubmit={res => {
					const classroom: Classroom = res.data;
					history.push(routes.auth.classroom.path.replace(':id', classroom.id));
					return alert.success('Classe créée avec succès');
				}}
				name="classroom"
				url="classrooms"
				action={FORM_ACTION.POST}
				inputGroups={[
					{
						name: 'name',
						inputType: 'text',
						required: true,
						minLength: 3,
						maxLength: 100,
					},
					{
						name: 'description',
						inputType: 'textarea',
						maxLength: 500,
					},
					{
						name: 'subject',
						inputType: 'select',
						required: true,
						selectOptions: CLASSROOM_SUBJECT,
					},
				]}
			/>
		</FormContainer>
	);
};

export default ClassroomForm;