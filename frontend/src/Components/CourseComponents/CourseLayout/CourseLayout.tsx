import { faCheckCircle, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { plainToClass } from 'class-transformer';
import { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Section } from '../../../Models/Course/section.entity';
import { CourseContext } from '../../../state/contexts/CourseContext';
import { ThemeContext } from '../../../state/contexts/ThemeContext';
import useRoutes from '../../../state/hooks/useRoutes';
import IconButton from '../../DashboardComponents/IconButton/IconButton';
import CenteredContainer from '../../UtilsComponents/CenteredContainer/CenteredContainer';
import Form from '../../UtilsComponents/Form/Form';
import { FORM_ACTION } from '../../UtilsComponents/Form/formTypes';
import FormModal from '../../UtilsComponents/FormModal/FormModal';
import Link from '../../UtilsComponents/Link/Link';
import { StyledCourseNavigation } from '../CourseNavigation/courseNavigationTypes';

const CourseLayout = () => {
	const { course, canEdit, isNavigationOpen, setTitle, addContent } =
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
					<div style={{ textAlign: 'center' }}>
						<label>{t('course.empty')}</label>
						{canEdit && (
							<Link onClick={() => setOpenModalSection(true)} dark block>
								{t('course.section.new')}
							</Link>
						)}
					</div>
				</div>
			</CenteredContainer>
			<FormModal
				open={openModalSection}
				title="Create section"
				setOpen={setOpenModalSection}
			>
				<Form
					name="section"
					url={`courses/${course.id}/sections`}
					action={FORM_ACTION.POST}
					customSubmit={(formValues: any) => {
						const section: Section = plainToClass(Section, formValues);
						addContent(section);
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
		</StyledCourseNavigation>
	);
};

export default CourseLayout;