import FormContainer from '../../../Components/UtilsComponents/FormContainer/FormContainer';
import { useTranslation } from 'react-i18next';
import Form from '../../UtilsComponents/Form/Form';
import { useNavigate, useLocation } from 'react-router';
import useRoutes from '../../../state/hooks/useRoutes';
import { useAlert } from 'react-alert';
import {
	COURSE_DIFFICULTY,
	COURSE_ACCESS,
	Course,
} from '../../../Models/Course/course.entity';
import { FORM_ACTION } from '../../UtilsComponents/Form/formTypes';
import { SUBJECTS } from '../../../Types/sharedTypes';
import { useContext } from 'react';
import { UserContext } from '../../../state/contexts/UserContext';
import { plainToInstance } from 'class-transformer';

/**
 * Form that creates a new course in the db and navigates to it
 *
 * @author MoSk3
 */
const CourseForm = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { routes } = useRoutes();
	const { user } = useContext(UserContext);
	const alert = useAlert();

	const location = useLocation();
	const state = location.state as any;
	const { classroom } =
		state && 'classroom' in state ? state : { classroom: undefined };

	return (
		<FormContainer title={t('form.title.create_course')}>
			<Form
				onSubmit={async res => {
					const course: Course = plainToInstance(Course, res.data);
					await user?.addCourse(course);
					navigate(routes.auth.course.path.replace(':id', course.id));
					return alert.success('Cours créé avec succès');
				}}
				name="course"
				url="courses"
				action={FORM_ACTION.POST}
				alterFormValues={formValues => {
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
						selectOptions: SUBJECTS,
						default: SUBJECTS.CODE,
					},
					{
						name: 'access',
						required: true,
						inputType: 'select',
						selectOptions: COURSE_ACCESS,
						default: COURSE_ACCESS.RESTRICTED,
					},
					{
						name: 'difficulty',
						required: true,
						inputType: 'select',
						selectOptions: COURSE_DIFFICULTY,
						default: COURSE_DIFFICULTY.MEDIUM,
					},
				]}
			/>
		</FormContainer>
	);
};

export default CourseForm;
