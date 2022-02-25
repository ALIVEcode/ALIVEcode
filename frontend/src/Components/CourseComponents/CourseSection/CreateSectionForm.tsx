import { plainToClass } from 'class-transformer';
import { useContext } from 'react';
import { Section } from '../../../Models/Course/section.entity';
import { CourseContext } from '../../../state/contexts/CourseContext';
import Form from '../../UtilsComponents/Form/Form';
import { FORM_ACTION } from '../../UtilsComponents/Form/formTypes';
import FormModal from '../../UtilsComponents/FormModal/FormModal';

const CreateSectionForm = ({
	openModalSection,
	setOpenModalSection,
	sectionParent,
}: {
	openModalSection: boolean;
	setOpenModalSection: (val: boolean) => void;
	sectionParent?: Section;
}) => {
	const { course, addContent } = useContext(CourseContext);
	return (
		<FormModal
			open={openModalSection}
			title="Create section"
			setOpen={setOpenModalSection}
			onSubmit={res => {
				const section: Section = plainToClass(Section, {
					name: res.data,
					elements: [],
					elementsOrder: [],
					courseElement: course,
				});

				addContent(section, sectionParent);
				setOpenModalSection(false);
			}}
		>
			<Form
				name="section"
				url={`courses/${course!.id}/sections`}
				action={FORM_ACTION.POST}
				customSubmit={(formValues: any) => {
					const section: Section = plainToClass(Section, formValues);
					addContent(section, sectionParent);
					setOpenModalSection(false);
				}}
				inputGroups={[
					{
						name: 'name',
						inputType: 'text',
						required: true,
						minLength: 3,
						maxLength: 100,
					},
				]}
			/>
		</FormModal>
	);
};

export default CreateSectionForm;
