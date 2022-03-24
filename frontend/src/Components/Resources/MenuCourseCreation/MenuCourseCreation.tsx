import { useForm } from 'react-hook-form';
import InputGroup from '../../UtilsComponents/InputGroup/InputGroup';
import api from '../../../Models/api';
import { useState, useContext, useMemo } from 'react';
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
import {
	MenuCourseCreationProps,
	MenuCourseCreationDTO,
} from './menuCourseCreationTypes';

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

	const onSelectSubject = async (newSubject: SUBJECTS) => {
		if (subject === newSubject) return setSubject(undefined);
		setSubject(newSubject);
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onSubmit = async (formValues: MenuCourseCreationDTO) => {
		if (!subject) return;
		formValues.course.subject = subject;
		formValues.classId = classroom?.id;
		if (updateMode && defaultCourse) {
			const updatedCourse = await api.db.courses.update(
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
			navigate(routes.auth.course.path.replace(':id', course.id));
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

	return (
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
		</MenuCreation>
	);
};

export default MenuCourseCreation;
