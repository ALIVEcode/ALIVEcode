import { faCheckCircle, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CourseContext } from '../../../state/contexts/CourseContext';
import { ThemeContext } from '../../../state/contexts/ThemeContext';
import useRoutes from '../../../state/hooks/useRoutes';
import IconButton from '../../DashboardComponents/IconButton/IconButton';
import CenteredContainer from '../../UtilsComponents/CenteredContainer/CenteredContainer';
import Link from '../../UtilsComponents/Link/Link';
import CreateSectionForm from '../CourseSection/CreateSectionForm';
import CourseLayoutElement from './CourseLayoutElement';
import { StyledCourseLayout } from './courseLayoutTypes';

const CourseLayout = () => {
	const {
		course,
		canEdit,
		isNavigationOpen,
		setTitle,
		addContent,
		courseElements,
	} = useContext(CourseContext);
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
		<StyledCourseLayout options={{ isNavigationOpen, editMode }} theme={theme}>
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
					<div style={{ textAlign: 'left' }}>
						{course.elementsOrder.length === 0 && (
							<label>{t('course.empty')}</label>
						)}
						{course.elementsOrder.map(id => (
							<CourseLayoutElement
								key={id}
								element={courseElements![id]}
								editMode={editMode}
							/>
						))}
						{canEdit && (
							<Link onClick={() => setOpenModalSection(true)} dark block>
								{t('course.section.new')}
							</Link>
						)}
					</div>
				</div>
			</CenteredContainer>
			<CreateSectionForm
				openModalSection={openModalSection}
				setOpenModalSection={setOpenModalSection}
			/>
		</StyledCourseLayout>
	);
};

export default CourseLayout;
