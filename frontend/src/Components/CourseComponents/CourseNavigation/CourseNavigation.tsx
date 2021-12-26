import CenteredContainer from '../../UtilsComponents/CenteredContainer/CenteredContainer';
import {
	CourseNavigationProps,
	StyledCourseNavigation,
} from './courseNavigationTypes';
import { useContext, useRef, useState } from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';
import CourseSection from '../CourseSection/CourseSection';
import useRoutes from '../../../state/hooks/useRoutes';
import { ThemeContext } from '../../../state/contexts/ThemeContext';
import Link from '../../UtilsComponents/Link/Link';
import FormModal from '../../UtilsComponents/FormModal/FormModal';
import Form from '../../UtilsComponents/Form/Form';
import { Section } from '../../../Models/Course/section.entity';
import { plainToClass } from 'class-transformer';
import { useTranslation } from 'react-i18next';
import { FORM_ACTION } from '../../UtilsComponents/Form/formTypes';
import Button from '../../UtilsComponents/Button/Button';
import IconButton from '../../DashboardComponents/IconButton/IconButton';
import { faCheckCircle, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

/**
 * Navigation menu of a course containing all the sections and activities
 *
 * @author MoSk3
 */
const CourseNavigation = (props: CourseNavigationProps) => {
	const { course, addSection, canEdit, isNavigationOpen, setTitle } =
		useContext(CourseContext);
	const { theme } = useContext(ThemeContext);
	const { routes, goTo } = useRoutes();
	const { t } = useTranslation();
	const titleRef = useRef<HTMLInputElement>(null);

	const [courseTitle, setCourseTitle] = useState(course?.name);

	const [openModalSection, setOpenModalSection] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [editTitle, setEditTitle] = useState(false);

	if (!course) {
		goTo(routes.auth.dashboard.path);
		return <></>;
	}

	return (
		<StyledCourseNavigation
			options={{ isNavigationOpen, editMode }}
			theme={theme}
		>
			<CenteredContainer horizontally>
				<div className="course-nav-header">
					{canEdit ? (
						<div className="course-nav-title">
							<div className="course-edit-button">
								{editMode && editTitle ? (
									<input
										ref={titleRef}
										type="text"
										autoFocus
										onBlur={event => {
											if (!(editMode && titleRef.current)) return;
											setTitle(titleRef.current.value);
											setCourseTitle(titleRef.current.value);
											console.log(titleRef.current.value);
											setEditTitle(false);
										}}
										defaultValue={courseTitle}
									/>
								) : (
									<span
										style={{ cursor: editMode ? 'pointer' : 'auto' }}
										onClick={() => editMode && setEditTitle(true)}
									>
										{courseTitle}
									</span>
								)}
								<IconButton
									icon={editMode ? faCheckCircle : faPencilAlt}
									onClick={() => {
										setEditMode(!editMode);
									}}
								/>
							</div>
						</div>
					) : (
						<div className="course-nav-title">{courseTitle}</div>
					)}
				</div>
				<div className="course-nav-body">
					{course.sections.length > 0 ? (
						<>
							{course.sections.map((s, idx) => (
								<CourseSection key={idx} section={s} editMode={editMode} />
							))}
							{canEdit && (
								<Link
									style={{ textAlign: 'center' }}
									onClick={() => setOpenModalSection(true)}
									dark
									block
								>
									{t('course.section.new')}
								</Link>
							)}
						</>
					) : (
						<div style={{ textAlign: 'center' }}>
							<label>{t('course.empty')}</label>
							{canEdit && (
								<Link onClick={() => setOpenModalSection(true)} dark block>
									{t('course.section.new')}
								</Link>
							)}
						</div>
					)}
				</div>
			</CenteredContainer>
			<FormModal
				open={openModalSection}
				title="Create section"
				onClose={() => setOpenModalSection(false)}
				onSubmit={res => {
					const section: Section = plainToClass(Section, res.data);
					addSection(section);
					setOpenModalSection(false);
				}}
			>
				<Form
					name="section"
					url={`courses/${course.id}/sections`}
					action={FORM_ACTION.POST}
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
		</StyledCourseNavigation>
	);
};

export default CourseNavigation;