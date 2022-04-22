import { useForm } from 'react-hook-form';
import InputGroup from '../../UtilsComponents/InputGroup/InputGroup';
import api from '../../../Models/api';
import { useState, useContext, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../../state/contexts/UserContext';
import TypeCard from '../../UtilsComponents/Cards/TypeCard/TypeCard';
import { SUBJECTS, getSubjectIcon } from '../../../Types/sharedTypes';
import useRoutes from '../../../state/hooks/useRoutes';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import MenuCreation from '../../UtilsComponents/MenuCreation/MenuCreation';
import { useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { Course } from '../../../Models/Course/course.entity';
import Button from '../../UtilsComponents/Buttons/Button';
import Link from '../../UtilsComponents/Link/Link';
import {
	MenuCourseCreationProps,
	MenuCourseCreationDTO,
} from './menuCourseCreationTypes';
import Modal from '../../UtilsComponents/Modal/Modal';
import { CourseTemplate } from '../../../Models/Course/bundles/course_template.entity';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import CourseTemplateCard from '../../Bundles/CourseTemplateCard/CourseTemplateCard';

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
			console.log('HERE');
			const getTemplates = async () => {
				const templates = await api.db.bundles.getCourseTemplates();
				console.log(templates);
				setTemplates(templates);
			};
			getTemplates();
		}
	}, [courseTemplateOpen]);

	/**
	 * Handle the chosing of a new subject for the course creation.
	 * @param newType New resource type to create
	 * @author Enric Soldevila
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
		formValues.classId = classroom?.id;
		if (updateMode && defaultCourse) {
			await api.db.courses.update(
				{
					id: defaultCourse.id,
				},
				formValues,
			);
		} else {
			const course = plainToInstance(
				Course,
				await api.db.courses.create(formValues),
			);
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
				<Button variant="primary" onClick={() => setCourseTemplateOpen(true)}>
					{t('course.template.add')}
				</Button>
				<Link onClick={() => handleSubmit(onSubmit)()}>
					{t('course.template.skip')}
				</Link>
			</div>
		);
	};

	return (
		<>
			<MenuCreation
				title={updateMode ? t('course.form.update') : t('course.form.create')}
				submitIcon={updateMode ? faCheckCircle : undefined}
				setOpen={setOpen}
				open={open}
				onSubmit={() => handleSubmit(onSubmit)()}
				disabledPageIndex={!updateMode ? (!subject ? 1 : undefined) : undefined}
			>
				{!updateMode && renderPageCourseSubject()}
				{renderPageCourseInfos()}
				{renderPageCourseTemplate()}
			</MenuCreation>
			<Modal
				open={courseTemplateOpen}
				setOpen={setCourseTemplateOpen}
				title={t('course.template.add')}
			>
				<div>
					{!templates ? (
						<LoadingScreen />
					) : (
						templates.map((t, idx) => (
							<CourseTemplateCard
								key={idx}
								onSelect={async template => {
									const newCourse =
										await api.db.bundles.createCourseFromTemplate(template.id);
									console.log(newCourse);
								}}
								template={t}
							></CourseTemplateCard>
						))
					)}
				</div>
			</Modal>
		</>
	);
};

export default MenuCourseCreation;
