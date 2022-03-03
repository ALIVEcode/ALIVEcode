import { useContext, useEffect, useRef, useState } from 'react';
import { useAlert } from 'react-alert';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import CourseLayout from '../../Components/CourseComponents/CourseLayout/CourseLayout';
import CreateSectionMenu from '../../Components/CourseComponents/CourseSection/CreateSectionMenu';
import CreationActivityMenu from '../../Components/CourseComponents/CreationActivityMenu/CreationActivityMenu';
import api from '../../Models/api';
import { Activity } from '../../Models/Course/activity.entity';
import { Course as CourseModel } from '../../Models/Course/course.entity';
import {
	CourseContent,
	CourseElement,
} from '../../Models/Course/course_element.entity';
import { Section } from '../../Models/Course/section.entity';
import {
	CourseContext,
	CourseContextValues,
} from '../../state/contexts/CourseContext';
import { UserContext } from '../../state/contexts/UserContext';
import { useForceUpdate } from '../../state/hooks/useForceUpdate';
import { UpdateCourseDTO } from '../../Models/Course/dtos/UpdateCourse.dto';

/**
 * Course page that shows the content of a course
 *
 * @param id (as a url parameter)
 * @author Enric, Mathis
 */
const Course = () => {
	const { user } = useContext(UserContext);
	const course = useRef<CourseModel>();
	const courseElements = useRef<{
		[id: number]: CourseElement;
	}>({});
	const section = useRef<Section>();
	const activity = useRef<Activity>();
	const [isNavigationOpen, setIsNavigationOpen] = useState(true);
	const [courseEditorMode, setCourseEditorMode] = useState<
		'navigation' | 'layout'
	>('layout');
	const { id } = useParams<{ id: string }>();

	const { t } = useTranslation();
	const alert = useAlert();
	const navigate = useNavigate();
	const update = useForceUpdate();

	const [openModalSection, setOpenModalSection] = useState(false);
	const [openModalActivity, setOpenModalActivity] = useState(false);
	const [sectionParent, setSectionParent] = useState<Section>();

	const titleRef = useRef<HTMLInputElement>(null);

	const [courseTitle, setCourseTitle] = useState(course.current?.name);

	const [editTitle, setEditTitle] = useState(false);

	/**
	 * Sets the course's title to a new one
	 *
	 * @param newTitle The new title of the course
	 * @author Mathis
	 */
	const setTitle = async (newTitle: string) => {
		if (!course.current) return;
		const updateCourseDTO: UpdateCourseDTO = {
			name: newTitle,
			difficulty: course.current.difficulty,
			access: course.current.access,
			subject: course.current.subject,
		};

		const updatedCourse = await api.db.courses.update(
			{ id: course.current.id },
			updateCourseDTO,
		);
		course.current.name = updatedCourse.name;
	};

	const openSectionForm = (sectionParent?: Section) => {
		setSectionParent(sectionParent);
		setOpenModalSection(true);
	};

	const openActivityForm = (sectionParent?: Section) => {
		setSectionParent(sectionParent);
		setOpenModalActivity(true);
	};

	/**
	 * Adds a new content ({@link Activity} or {@link Section}) to the course.
	 *
	 * @param content the content to add to the course
	 * @param sectionParent where to add the content (if undefined, added to the course top level)
	 * @author Mathis
	 */
	const addContent = async (
		content: CourseContent,
		sectionParent?: Section,
	) => {
		if (!course.current || !courseElements.current) return;
		const { courseElement, newOrder } = await api.db.courses.addContent(
			course.current.id,
			content,
			sectionParent?.id,
		);

		courseElement.initialize();
		const parent = sectionParent ?? course.current;
		parent.elementsOrder = newOrder;
		parent.elements.push(courseElement);

		courseElements.current[courseElement.id] = courseElement;

		update();
	};

	/**
	 * Deletes and removes an element in the course
	 *
	 * @param element the element to delete from the course
	 * @author Mathis
	 */
	const deleteElement = async (element: CourseElement) => {
		if (!course.current || !courseElements) return;
		const res = await api.db.courses.deleteElement({
			courseId: course.current.id,
			elementId: element.id.toString(),
		});

		const parent = element.getParent();

		parent.elementsOrder = parent.elementsOrder.filter(el => el !== element.id);
		parent.elements = parent.elements.filter(el => el.id !== element.id);
		delete courseElements.current[element.id];
		update();
	};

	/**
	 * Loads the elements contained in a section
	 *
	 * @param section the section you want to load the elements
	 * @author Mathis
	 */
	const loadSectionElements = async (section: Section) => {
		if (!course.current || !section || !courseElements.current) return;

		const elements = await api.db.courses.getElementsInSection({
			courseId: course.current.id,
			sectionId: section.id.toString(),
		});

		elements.forEach(el => {
			el.sectionParent = section;
			course.current && (el.course = course.current);
			el.initialize();
			courseElements.current[el.id] = el;
		});

		section.elements = elements;
		update();
	};

	const renameElement = async (element: CourseElement, newName: string) => {
		element.name = newName;
	};

	// const saveActivity = async (activity: Activity) => {
	// 	if (!course || !activity || !section) return;
	// 	const { course_element, ...actWithoutContent } = activity;
	// 	(actWithoutContent as any).levels = undefined;

	// 	const updatedAct = await api.db.courses.updateActivity(
	// 		{
	// 			courseId: course.id,
	// 			sectionId: section.id.toString(),
	// 			activityId: activity.id.toString(),
	// 		},
	// 		actWithoutContent,
	// 	);
	// 	activity.name = updatedAct.name;
	// 	activity.course_element = updatedAct.course_element;
	// 	setActivity(activity);
	// };

	// 	activity.name = updatedAct.name;
	// 	activity.course_element = updatedAct.course_element;
	// 	setActivity(activity);
	// };

	// const loadActivity = async (section: Section, activity: Activity) => {
	// 	if (!course) return;
	// 	await activity.getContent(course?.id, section.id);
	// 	setActivity(activity);
	// 	setSection(section);
	// };

	// const closeCurrentActivity = () => {
	// 	setActivity(undefined);
	// };

	const deleteSectionRecursivelly = async (element: CourseElement) => {
		// TODO add a route that deletes all the elements of a section
		if (!element) return;
		if (element.section) {
			element.section.elements.forEach(
				async el => await deleteSectionRecursivelly(el),
			);
		}
		await deleteElement(element);
	};

	const loadSectionRecursivelly = async (element: CourseElement) => {
		if (!element.section) return;
		await loadSectionElements(element.section);
		element.section.elements.forEach(
			async el => await loadSectionRecursivelly(el),
		);
	};

	const canEdit = course.current?.creator.id === user?.id;

	const contextValue: CourseContextValues = {
		course: course.current,
		section,
		activity,
		courseElements: courseElements,
		canEdit,
		isNavigationOpen,
		courseEditorMode,
		renameElement,
		setCourseEditorMode,
		setTitle,
		addContent,
		loadSectionElements,
		// loadActivity,
		// closeCurrentActivity,
		// saveActivity,
		// saveActivityContent,
		setIsNavigationOpen,
		deleteElement,
		moveElement: async (..._) => {},
		loadActivity: (section: Section, activity: Activity) => {
			throw new Error('Function not implemented.');
		},
		closeCurrentActivity: () => {
			throw new Error('Function not implemented.');
		},
		saveActivity: (activity: Activity) => {
			throw new Error('Function not implemented.');
		},
		saveActivityContent: (data: string) => {
			throw new Error('Function not implemented.');
		},
		openActivityForm,
		openSectionForm,
	};

	/**
	 * This is where the course is loaded from the database
	 */
	useEffect(() => {
		if (!id) return;
		const getCourse = async () => {
			try {
				const courseLoaded: CourseModel = await api.db.courses.get({
					id,
				});
				course.current = courseLoaded;
				const elements = await api.db.courses.getElements({ courseId: id });

				elements.forEach(async el => {
					course.current && (el.course = course.current);
					courseElements.current[el.id] = el;
					await loadSectionRecursivelly(el);
				});
				course.current.elements = elements;
				setCourseTitle(course.current.name);
				update();
			} catch (err) {
				navigate('/');
				return alert.error(t('error.not_found', { obj: t('msg.course') }));
			}
		};
		getCourse();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, user]);

	if (!course.current) return <></>;
	return (
		<CourseContext.Provider value={contextValue}>
			<div className="w-full h-full bg-[color:var(--background-color)]">
				<div className="border-2 border-[color:var(--bg-shade-four-color)]">
					{canEdit ? (
						<div className="text-4xl text-left text-[color:var(--foreground-color)] pl-5 pt-3 pb-3">
							<div className="course-edit-button">
								{editTitle ? (
									<input
										ref={titleRef}
										type="text"
										autoFocus
										onBlur={event => {
											if (!titleRef.current) return;
											setTitle(titleRef.current.value);
											setCourseTitle(titleRef.current.value);
											setEditTitle(false);
										}}
										defaultValue={courseTitle}
									/>
								) : (
									<span
										style={{ cursor: canEdit ? 'pointer' : 'auto' }}
										onClick={() => canEdit && setEditTitle(true)}
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
				{/*<CourseNavigation />
				<ActivityContent />*/}
				{courseEditorMode === 'layout' ? (
					<CourseLayout />
				) : (
					<>COURSE NAV UNDER CONSTRUCTION</>
				)}
			</div>
			<CreateSectionMenu
				openModalSection={openModalSection}
				setOpenModalSection={setOpenModalSection}
				sectionParent={sectionParent}
			/>
			<CreationActivityMenu
				open={openModalActivity}
				setOpen={setOpenModalActivity}
				sectionParent={sectionParent}
			/>
		</CourseContext.Provider>
	);
};

export default Course;
