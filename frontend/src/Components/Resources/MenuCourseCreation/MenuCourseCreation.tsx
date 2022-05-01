import { useForm } from 'react-hook-form';
import InputGroup from '../../UtilsComponents/InputGroup/InputGroup';
import api from '../../../Models/api';
import { useState, useContext, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../../state/contexts/UserContext';
import TypeCard from '../../UtilsComponents/Cards/TypeCard/TypeCard';
import { SUBJECTS, getSubjectIcon } from '../../../Types/sharedTypes';
import useRoutes from '../../../state/hooks/useRoutes';
import { instanceToPlain } from 'class-transformer';
import { useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { Course, COURSE_ACCESS } from '../../../Models/Course/course.entity';
import Button from '../../UtilsComponents/Buttons/Button';
import {
	MenuCourseCreationProps,
	MenuCourseCreationDTO,
} from './menuCourseCreationTypes';
import Modal from '../../UtilsComponents/Modal/Modal';
import { CourseTemplate } from '../../../Models/Course/bundles/course_template.entity';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import CourseTemplateCard from '../../Bundles/CourseTemplateCard/CourseTemplateCard';
import Timeline from '../../UtilsComponents/Modal/Timeline';

/**
 * Menu that allows for the creation and updating of a course
 *
 * @param open state of the menu
 * @param setOpen the state handler of the menu
 * @param updateMode (Optional) If the menu is in edit mode or not (create mode)
 * @param defaultCourse (Optional) The default course to update in updateMode
 * @param classroom (Optional) The classroom in which to add the course
 * @returns The rendered menu
 * @author Enric Soldevila
 */
const MenuCourseCreation = ({
	open,
	setOpen,
	updateMode,
	defaultCourse,
	classroom,
}: MenuCourseCreationProps) => {
	const [subject, setSubject] = useState<SUBJECTS | undefined>(
		defaultCourse?.subject ?? undefined,
	);
	const [courseTemplateOpen, setCourseTemplateOpen] = useState(false);
	const [templates, setTemplates] = useState<CourseTemplate[]>();
	const [selectedTemplate, setSelectedTemplate] = useState<CourseTemplate>();
	const { t } = useTranslation();
	const { user } = useContext(UserContext);
	const { routes } = useRoutes();
	const alert = useAlert();
	const navigate = useNavigate();
	const defaultValues = useMemo(() => {
		return { course: instanceToPlain(defaultCourse) };
	}, [defaultCourse]);

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<MenuCourseCreationDTO>({
		defaultValues,
	});

	useEffect(() => {
		if (courseTemplateOpen) {
			const getTemplates = async () => {
				const templates = await api.db.bundles.getCourseTemplates();
				setTemplates(templates);
			};
			getTemplates();
		}
	}, [courseTemplateOpen]);

	/**
	 * Handle the choosing of a new subject for the course creation.
	 * @author Enric Soldevila
	 * @param newSubject
	 */
	const onSelectSubject = async (newSubject: SUBJECTS) => {
		if (subject === newSubject) return setSubject(undefined);
		setSubject(newSubject);
	};

	/**
	 * Handles the form submission. Sends data to the server to update
	 * or create the course with all the properties chosen in the menu.
	 * @param formValues Form values returned by the form submission
	 * @author Enric Soldevila
	 */
	const onSubmit = async (formValues: MenuCourseCreationDTO) => {
		if (!subject) return;
		formValues.course.subject = subject;
		formValues.course.access = COURSE_ACCESS.RESTRICTED;
		formValues.classId = classroom?.id;
		if (updateMode && defaultCourse) {
			await api.db.courses.update(
				{
					id: defaultCourse.id,
				},
				formValues,
			);
		} else {
			let course: Course;
			if (selectedTemplate) {
				course = await api.db.bundles.createCourseFromTemplate(
					selectedTemplate.id,
					formValues,
				);
			} else {
				course = await api.db.courses.create(formValues);
			}
			await user?.addCourse(course);
			navigate(routes.auth.course.path.replace(':id', course.id) + '/layout');
			return alert.success('Cours créé avec succès');
		}
		setOpen(false);
	};

	const renderPageCourseSubject = () => {
		return (
			<div className="bg-[color:var(--background-color)] gap-8 grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3">
				{Object.entries(SUBJECTS).map((entry, idx) => (
					<TypeCard
						key={idx}
						title={t(`msg.subjects.${entry[0].toLowerCase()}`)}
						icon={getSubjectIcon(entry[1])}
						onClick={() => onSelectSubject(entry[1])}
						selected={subject === entry[1]}
					/>
				))}
			</div>
		);
	};

	/**
	 * Renders the inputs and labels necessary for a course (name and description).
	 * @returns Rendered second page of menu
	 * @author Enric Soldevila
	 */
	const renderPageCourseInfos = () => {
		return (
			<div className="tablet:px-8 laptop:px-16 desktop:px-36">
				<InputGroup
					label={t('course.form.name')}
					errors={errors.course?.name}
					{...register('course.name', { required: true })}
				/>
				<InputGroup
					label={t('course.form.description')}
					errors={errors.course?.description}
					{...register('course.description', { maxLength: 500 })}
				/>
			</div>
		);
	};

	const renderPageCourseTemplate = () => {
		return (
			<div className="tablet:px-8 laptop:px-16 desktop:px-36 flex flex-col text-center">
				{selectedTemplate ? (
					<>
						<CourseTemplateCard template={selectedTemplate} />
						<Button
							variant="danger"
							onClick={() => setSelectedTemplate(undefined)}
						>
							{t('course.template.remove')}
						</Button>
					</>
				) : (
					<Button variant="primary" onClick={() => setCourseTemplateOpen(true)}>
						{t('course.template.add')}
					</Button>
				)}
			</div>
		);
	};

	return (
		<>
			<Timeline.Modal
				title={updateMode ? t('course.form.update') : t('course.form.create')}
				setOpen={setOpen}
				open={open}
				onSubmit={handleSubmit(onSubmit)}
				submitText={t('course.form.create')}
				submitButtonVariant="primary"
			>
				<Timeline.Page
					goNextWhen={subject != null}
					autoNext
					canGoNext={subject != null}
				>
					{renderPageCourseSubject()}
				</Timeline.Page>
				<Timeline.Page>{renderPageCourseInfos()}</Timeline.Page>
				<Timeline.Page>{renderPageCourseTemplate()}</Timeline.Page>
			</Timeline.Modal>
			<Modal
				open={courseTemplateOpen}
				setOpen={setCourseTemplateOpen}
				title={t('course.template.add')}
				size="md"
			>
				<>
					{!templates ? (
						<LoadingScreen />
					) : (
						<div className="grid grid-cols-1 desktop:grid-cols-2 gap-y-4">
							{templates.map(t => (
								<div key={t.id} className="m-auto">
									<CourseTemplateCard
										onSelect={async template => {
											setSelectedTemplate(template);
											setCourseTemplateOpen(false);
										}}
										template={t}
									/>
								</div>
							))}
						</div>
					)}
				</>
			</Modal>
		</>
	);
};

export default MenuCourseCreation;
