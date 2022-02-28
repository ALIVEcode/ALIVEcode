import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CourseContext } from '../../../state/contexts/CourseContext';
import { ThemeContext } from '../../../state/contexts/ThemeContext';
import useRoutes from '../../../state/hooks/useRoutes';
import CenteredContainer from '../../UtilsComponents/CenteredContainer/CenteredContainer';
import Link from '../../UtilsComponents/Link/Link';
import CourseLayoutElement from './CourseLayoutElement';
import { StyledCourseLayout } from './courseLayoutTypes';

const CourseLayout = () => {
	const {
		course,
		canEdit,
		isNavigationOpen,
		setTitle,
		courseElements,
		openSectionForm,
		openActivityForm,
	} = useContext(CourseContext);
	const { theme } = useContext(ThemeContext);
	const { routes, goTo } = useRoutes();
	const { t } = useTranslation();
	const titleRef = useRef<HTMLInputElement>(null);

	const [courseTitle, setCourseTitle] = useState(course?.name);

	const [editMode, setEditMode] = useState(false);
	const [editTitle, setEditTitle] = useState(false);

	if (!course) {
		goTo(routes.auth.dashboard.path);
		return <></>;
	}

	return (
		<StyledCourseLayout
			options={{ isNavigationOpen, editMode }}
			theme={theme}
			className="bg-[color:var(--background-color)]"
		>
			<CenteredContainer horizontally className="">
				<div className="border-2 border-[color:var(--bg-shade-four-color)]">
					{canEdit ? (
						<div className="text-4xl text-left text-[color:var(--foreground-color)] pl-5 pt-3 pb-3">
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
								{/* <IconButton
									icon={editMode ? faCheckCircle : faPencilAlt}
									onClick={() => {
										setEditMode(!editMode);
									}}
								/> */}
							</div>
						</div>
					) : (
						<div className="course-nav-title">{courseTitle}</div>
					)}
				</div>

				<div className="pl-52 pr-52 relative pt-10">
					<FontAwesomeIcon
						icon={faArrowLeft}
						color="black"
						size="4x"
						className="pl-5 absolute top-0 left-0"
					/>
					<div style={{ textAlign: 'left' }}>
						{course.elementsOrder.length === 0 && (
							<label>{t('course.empty')}</label>
						)}

						{courseElements?.current &&
							course.elementsOrder.map(
								id =>
									id in courseElements.current && (
										<CourseLayoutElement
											key={id}
											element={courseElements.current[id]}
											editMode={editMode}
										/>
									),
							)}
						{canEdit && (
							<>
								<Link onClick={openSectionForm} dark block>
									{t('course.section.new')}
								</Link>
								<Link onClick={openActivityForm} dark block>
									{t('course.activity.new')}
								</Link>
							</>
						)}
					</div>
				</div>
			</CenteredContainer>
		</StyledCourseLayout>
	);
};

export default CourseLayout;
