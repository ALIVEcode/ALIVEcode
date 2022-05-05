import Form from '../../UtilsComponents/Form/Form';
import { ClassroomSettingsProps } from './classroomSettingsTypes';
import { FORM_ACTION } from '../../UtilsComponents/Form/formTypes';
import { CLASSROOM_ACCESS } from '../../../Models/Classroom/classroom.entity';
import { SUBJECTS } from '../../../Types/sharedTypes';

const ClassroomSettings = ({ classroom, onSubmit }: ClassroomSettingsProps) => {
	return (
		<Form
			onSubmit={onSubmit}
			name="classroom"
			url={`classrooms/${classroom.id}`}
			action={FORM_ACTION.PATCH}
			inputGroups={[
				{
					name: 'name',
					inputType: 'text',
					required: true,
					minLength: 3,
					maxLength: 100,
					default: classroom.name,
				},
				{
					name: 'description',
					inputType: 'textarea',
					maxLength: 500,
					default: classroom.description,
				},
				{
					name: 'subject',
					inputType: 'select',
					required: true,
					selectOptions: SUBJECTS,
					default: classroom.subject,
				},
				{
					name: 'access',
					inputType: 'select',
					required: true,
					selectOptions: CLASSROOM_ACCESS,
					default: classroom.access,
				},
			]}
		/>
	);
};

export default ClassroomSettings;
