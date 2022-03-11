import { ClassroomFormProps } from './classroomFormTypes';
import Form from '../../UtilsComponents/Form/Form';
import FormContainer from '../../UtilsComponents/FormContainer/FormContainer';
import { useTranslation } from 'react-i18next';
import {
	CLASSROOM_SUBJECT,
	Classroom,
	CLASSROOM_ACCESS,
} from '../../../Models/Classroom/classroom.entity';
import useRoutes from '../../../state/hooks/useRoutes';
import { useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { FORM_ACTION } from '../../UtilsComponents/Form/formTypes';
import { useContext } from 'react';
import { UserContext } from '../../../state/contexts/UserContext';
import { plainToInstance } from 'class-transformer';

/**
 * Form that creates a new classroom in the db and navigates to it
 *
 * @author Enric Soldevila
 */
const ClassroomForm = (props: ClassroomFormProps) => {
	const { t } = useTranslation();
	const { routes } = useRoutes();
	const navigate = useNavigate();
	const alert = useAlert();
	const { user } = useContext(UserContext);

	return (
		<FormContainer title={t('form.title.create_classroom')}>
			<Form
				onSubmit={async res => {
					const classroom: Classroom = plainToInstance(Classroom, res.data);
					await user?.addClassroom(classroom);
					navigate(
						routes.auth.dashboard.path + `/classroom?id=${classroom.id}`,
					);
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
						default: CLASSROOM_SUBJECT.INFORMATIC,
					},
					{
						name: 'access',
						inputType: 'select',
						required: true,
						selectOptions: CLASSROOM_ACCESS,
						default: CLASSROOM_ACCESS.PRIVATE,
					},
				]}
			/>
		</FormContainer>
	);
};

export default ClassroomForm;
