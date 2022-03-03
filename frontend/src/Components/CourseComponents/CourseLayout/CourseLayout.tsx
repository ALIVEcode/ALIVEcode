import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CourseContext } from '../../../state/contexts/CourseContext';
import useRoutes from '../../../state/hooks/useRoutes';
import CenteredContainer from '../../UtilsComponents/CenteredContainer/CenteredContainer';
import ButtonAddCourseElement from './ButtonAddCourseElement';
import CourseLayoutElement from './CourseLayoutElement';

const CourseLayout = () => {
	const {
		course,
		canEdit,
		setTitle,
		courseElements,
		isEditMode,
		setCourseEditorMode,
	} = useContext(CourseContext);
	const { routes, goTo } = useRoutes();
	const { t } = useTranslation();
	const titleRef = useRef<HTMLInputElement>(null);

	const [courseTitle, setCourseTitle] = useState(course?.name);

	const [editTitle, setEditTitle] = useState(false);

	if (!course) {
		goTo(routes.auth.dashboard.path);
		return <></>;
	}

	return (
		<div className="bg-[color:var(--background-color)] w-[100%]">
			<div className="border-2 border-[color:var(--bg-shade-four-color)]">
				{canEdit ? (
					<div className="text-4xl text-left text-[color:var(--foreground-color)] pl-5 pt-3 pb-3">
						<div className="course-edit-button">
							{isEditMode && editTitle ? (
								<input
									ref={titleRef}
									type="text"
									autoFocus
									onBlur={event => {
										if (!(isEditMode && titleRef.current)) return;
										setTitle(titleRef.current.value);
										setCourseTitle(titleRef.current.value);
										setEditTitle(false);
									}}
									defaultValue={courseTitle}
								/>
							) : (
								<span
									style={{ cursor: isEditMode ? 'pointer' : 'auto' }}
									onClick={() => isEditMode && setEditTitle(true)}
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

			<div className="relative pt-3">
				<FontAwesomeIcon
					icon={faArrowLeft}
					size="4x"
					className="pl-5 md:sticky z-[1000] left-0 top-14 hover:cursor-pointer [color:var(--foreground-color)]"
					onClick={() => setCourseEditorMode('navigation')}
				/>

				<CenteredContainer
					horizontally
					className="md:px-52 pl-3 pr-12 min-w-fit w-[100%] whitespace-nowrap"
				>
					<div className="text-left ">
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
										/>
									),
							)}
					</div>
					<div className="pb-5">{canEdit && <ButtonAddCourseElement />}</div>
				</CenteredContainer>
			</div>
		</div>
	);
};

export default CourseLayout;
