import { plainToClass } from 'class-transformer';
import { useContext } from 'react';
import { Section } from '../../../Models/Course/section.entity';
import { CourseContext } from '../../../state/contexts/CourseContext';
import Form from '../../UtilsComponents/Form/Form';
import { FORM_ACTION } from '../../UtilsComponents/Form/formTypes';
import FormModal from '../../UtilsComponents/FormModal/FormModal';

/**
 * @deprecated
 * Creation Menu for a section
 * @param openModalSection The state of the menu (false -> close, true -> opened)
 * @param setOpenModalSection The function to change the state of the menu
 * @param sectionParent (Optional) Section parent of the element. If undefined, the element is in the course
 * @returns The Creation menu for a section
 *
 * @author Enric Soldevila
 */
const CreateSectionMenu = ({
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
		>
			<Form
				name="section"
				url={`courses/${course!.id}/sections`}
				action={FORM_ACTION.POST}
				customSubmit={async (formValues: any) => {
					const section: Section = plainToClass(Section, {});
					await addContent(section, `New Section`, sectionParent);
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

export default CreateSectionMenu;
