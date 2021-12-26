import FormContainer from '../../../Components/UtilsComponents/FormContainer/FormContainer';
import { useTranslation } from 'react-i18next';
import Form from '../../UtilsComponents/Form/Form';
import { useHistory, useLocation } from 'react-router';
import useRoutes from '../../../state/hooks/useRoutes';
import { useAlert } from 'react-alert';
import { CourseFormLocation } from './courseFormTypes';
import {
	COURSE_DIFFICULTY,
	COURSE_SUBJECT,
	COURSE_ACCESS,
	Course,
} from '../../../Models/Course/course.entity';
import { FORM_ACTION } from '../../UtilsComponents/Form/formTypes';

/**
 * Form that creates a new course in the db and navigates to it
 *
 * @author MoSk3
 */
const CourseForm = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const { routes } = useRoutes();
	const alert = useAlert();

	const location = useLocation<CourseFormLocation>();
	const { classroom } = location.state;

	return (
		<FormContainer title={t('form.title.create_course')}>
			<Form
				onSubmit={res => {
					const course: Course = res.data;
					history.push(routes.auth.course.path.replace(':id', course.id));
					return alert.success('Cours créé avec succès');
				}}
				name="course"
				url="courses"
				action={FORM_ACTION.POST}
				alterFormValues={formValues => {
					console.log(formValues);
					if (!classroom) return { course: formValues };
					return { classId: classroom.id, course: formValues };
				}}
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
						inputType: 'text',
						maxLength: 500,
					},
					{
						name: 'subject',
						required: true,
						inputType: 'select',
						selectOptions: COURSE_SUBJECT,
					},
					{
						name: 'access',
						required: true,
						inputType: 'select',
						selectOptions: COURSE_ACCESS,
					},
					{
						name: 'difficulty',
						required: true,
						inputType: 'select',
						selectOptions: COURSE_DIFFICULTY,
					},
				]}
			/>
		</FormContainer>
	);
};

export default CourseForm;