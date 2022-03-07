import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { useAlert } from 'react-alert';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import CourseBody from '../../Components/CourseComponents/CourseBody/CourseBody';
import CourseLayout from '../../Components/CourseComponents/CourseLayout/CourseLayout';
import CourseNavigation from '../../Components/CourseComponents/CourseNavigation/CourseNavigation';
import CreateSectionMenu from '../../Components/CourseComponents/CourseSection/CreateSectionMenu';
import CreationActivityMenu from '../../Components/CourseComponents/CreationActivityMenu/CreationActivityMenu';
import FormInput from '../../Components/UtilsComponents/FormInput/FormInput';
import LoadingScreen from '../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import api from '../../Models/api';
import { Activity } from '../../Models/Course/activity.entity';
import { Course as CourseModel } from '../../Models/Course/course.entity';
import {
	CourseContent,
	CourseElement,
} from '../../Models/Course/course_element.entity';
import { UpdateCourseDTO } from '../../Models/Course/dtos/UpdateCourse.dto';
import { Section } from '../../Models/Course/section.entity';
import {
	CourseContext,
	CourseContextValues,
} from '../../state/contexts/CourseContext';
import { UserContext } from '../../state/contexts/UserContext';
import { useForceUpdate } from '../../state/hooks/useForceUpdate';
import { SwitchCourseTabReducer } from './courseTypes';

/**
 * Course page that shows the content of a course
 *
 * @author Enric, Mathis
 */
const Course = () => {
	const { user } = useContext(UserContext);
	const course = useRef<CourseModel>();
	const courseElements = useRef<{
		[id: number]: CourseElement;
	}>({});
	const newCourseElementId = useRef<number>();
	const [isNavigationOpen, setIsNavigationOpen] = useState(true);
	const [tabSelected, setTabSelected] = useReducer(SwitchCourseTabReducer, {
		tab: 'layout',
	});
	const { id } = useParams<{ id: string }>();
	const [loading, setLoading] = useState(true);
	const { t } = useTranslation();
	const alert = useAlert();
	const navigate = useNavigate();
	const update = useForceUpdate();

	const [openModalSection, setOpenModalSection] = useState(false);
	const [openModalActivity, setOpenModalActivity] = useState(false);
	const [sectionParent, setSectionParent] = useState<Section>();
	const [openedActivity, setOpenedActivity] = useState<Activity>();

	const titleRef = useRef<HTMLInputElement>(null);

	const [courseTitle, setCourseTitle] = useState(course.current?.name);

	const [editTitle, setEditTitle] = useState(false);

	/**
	 * Indicates if the element was just added (is new)
	 *
	 * @param element Element that wants to know if it is new or not
	 * @author Mathis
	 */
	const isNewCourseElement = (element: CourseElement) => {
		return (
			newCourseElementId.current !== undefined &&
			element.id === newCourseElementId.current
		);
	};
	const setCourseElementNotNew = (element: CourseElement) => {
		if (isNewCourseElement(element)) newCourseElementId.current = undefined;
	};

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

	/**
	 * Sets the state of the section creation modal to true
	 *
	 * @param sectionParent the section in which we create this new section
	 * @author Mathis
	 */
	const openSectionForm = (sectionParent?: Section) => {
		setSectionParent(sectionParent);
		setOpenModalSection(true);
	};

	/**
	 * Sets the state of the activity creation modal to true
	 *
	 * @param sectionParent the section in which we create this new activity
	 * @author Mathis
	 */
	const openActivityForm = (sectionParent?: Section) => {
		setSectionParent(sectionParent);
		setOpenModalActivity(true);
	};

	/**
	 * Adds a new content ({@link Activity} or {@link Section}) to the course.
	 *
	 * @param content the content to add to the course
	 * @param name the name of the acitivity
	 * @param sectionParent where to add the content (if undefined, added to the course top level)
	 * @author Mathis
	 */
	const addContent = async (
		content: CourseContent,
		name: string,
		sectionParent?: Section,
	) => {
		if (!course.current || !courseElements.current) return;
		const { courseElement, newOrder } = await api.db.courses.addContent(
			course.current.id,
			content,
			name,
			sectionParent?.id,
		);

		courseElement.initialize();
		const parent = sectionParent ?? course.current;
		parent.elementsOrder = newOrder;
		parent.elements.push(courseElement);

		courseElements.current[courseElement.id] = courseElement;
		newCourseElementId.current = courseElement.id;
		update();
	};

	/**
	 * Deletes and removes an element in the course
	 *
	 * @param element the element to delete from the course
	 * @author Mathis
	 */
	const deleteElement = async (element: CourseElement) => {
		if (!course.current || !courseElements.current) return;
		await api.db.courses.deleteElement({
			courseId: course.current.id,
			elementId: element.id.toString(),
		});
		deleteElementRecursively(element);

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
			courseElements.current[el.id] = el;
			el.initialize();
		});

		section.elements = elements;
		update();
	};

	/**
	 * Changes the name of the element passed in argument to the new name
	 * Also changes the name of the element in the database
	 *
	 * @param element the element to rename
	 * @param newName the new name of the element
	 * @author Mathis Laroche
	 */
	const renameElement = async (element: CourseElement, newName: string) => {
		if (!course.current) return;
		element.name = newName;

		await api.db.courses.updateElement(
			{ elementId: element.id.toString(), courseId: course.current.id },
			{ name: newName },
		);
		update();
	};

	/**
	 * Set the activity opened to the activity passed in argument
	 *
	 * @param activity the activity to open
	 * @author Enric
	 */
	const openActivity = async (activity: Activity) => {
		setOpenedActivity(activity);
	};

	/**
	 * Resets the opened activity to undefined => close the current activity
	 *
	 * @author Enric
	 */
	const closeOpenedActivity = () => {
		setOpenedActivity(undefined);
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

	/**
	 * Deletes the element passed in argument. If the element is a section,
	 * it will also deletes its children, and so on, recursively.
	 *
	 * @param element The element to delete
	 * @author Mathis
	 */
	const deleteElementRecursively = (element: CourseElement) => {
		if (element.section) {
			[...element.section.elements].forEach(el => deleteElementRecursively(el));
		}
		element.delete();
		delete courseElements.current[element.id];
	};

	/**
	 * Loads all the children elements of the section from the database, recursively
	 *
	 * @param element the element to load
	 * @author Mathis
	 */
	const loadSectionRecursively = async (element: CourseElement) => {
		// FIXME some elements are loaded twice

		if (!element.section) return;
		await loadSectionElements(element.section);
		for (const el of element.section.elements) {
			await loadSectionRecursively(el);
		}
	};

	const canEdit = course.current?.creator.id === user?.id;

	const contextValue: CourseContextValues = {
		course: course.current,
		courseElements: courseElements,
		setCourseElementNotNew,
		isNewCourseElement,
		canEdit,
		isNavigationOpen,
		tabSelected,
		setTabSelected,
		renameElement,
		setTitle,
		addContent,
		loadSectionElements,
		// closeCurrentActivity,
		// saveActivity,
		// saveActivityContent,
		setIsNavigationOpen,
		deleteElement,
		moveElement: async (..._) => {},
		saveActivity: (activity: Activity) => {
			throw new Error('Function not implemented.');
		},
		saveActivityContent: (data: string) => {
			throw new Error('Function not implemented.');
		},
		openActivityForm,
		openSectionForm,
		openActivity,
		closeOpenedActivity,
		openedActivity,
	};

	/**
	 * This is where the course is loaded from the database
	 */
	useEffect(() => {
		if (!id) return;
		const getCourse = async () => {
			try {
				course.current = await api.db.courses.get({
					id,
				});
				const elements = await api.db.courses.getElements({ courseId: id });

				for (const el of elements) {
					if (!course.current) {
						console.error('Something went wrong, not loading element ' + el);
						continue;
					}
					el.course = course.current;
					courseElements.current[el.id] = el;
					el.initialize();
					await loadSectionRecursively(el);
				}
				course.current.elements = elements;
				setCourseTitle(course.current.name);
				update();
				setLoading(false);
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
			<div className="w-full h-full flex flex-col bg-[color:var(--background-color)] text-[color:var(--foreground-color)]">
				<div className="border-b border-[color:var(--bg-shade-four-color)]">
					<div className="text-4xl text-left text-[color:var(--foreground-color)] pl-5 pt-3 pb-3">
						{canEdit ? (
							editTitle ? (
								<FormInput
									ref={titleRef}
									type="text"
									autoFocus
									onBlur={() => {
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
									onDoubleClick={() => canEdit && setEditTitle(true)}
								>
									{courseTitle}
								</span>
							)
						) : (
							courseTitle
						)}
					</div>
				</div>

				{loading ? (
					<LoadingScreen />
				) : tabSelected.tab === 'layout' ? (
					<CourseLayout />
				) : (
					<div className="flex w-full h-full overflow-y-auto">
						<div className="w-1/4 h-full overflow-y-auto">
							<CourseNavigation></CourseNavigation>
						</div>
						<div className="w-3/4 h-full overflow-y-auto">
							<CourseBody></CourseBody>
						</div>
					</div>
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
