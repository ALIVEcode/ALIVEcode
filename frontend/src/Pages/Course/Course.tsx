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
 * @param id (as a url parameter)
 * @author Enric, Mathis
 */
const Course = () => {
	const { user } = useContext(UserContext);
	const course = useRef<CourseModel>();
	const courseElements = useRef<{
		[id: number]: CourseElement;
	}>({});
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
		await api.db.courses.deleteElement({
			courseId: course.current.id,
			elementId: element.id.toString(),
		});
		deleteSectionRecursively(element);

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

	const renameElement = async (element: CourseElement, newName: string) => {
		element.name = newName;
		//TODO add call to an update route in api
	};

	const openActivity = async (activity: Activity) => {
		setOpenedActivity(activity);
	};

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

	const deleteElementAndChildren = (element: CourseElement) => {
		// if we dont have to delete anything, we skip the computation
		if (!(element.id in courseElements.current)) {
			return;
		}

		const parent = element.parent;

		const toDelete = [element.id].concat(
			element.section?.elementsOrder ? element.section.elementsOrder : [],
		);

		parent.elementsOrder = parent.elementsOrder.filter(
			id => !toDelete.includes(id),
		);
		parent.elements = parent.elements.filter(el => !toDelete.includes(el.id));

		for (const id of toDelete) delete courseElements.current[id];
	};

	const deleteSectionRecursively = (element: CourseElement) => {
		if (element.section) {
			[...element.section.elements].forEach(el => deleteSectionRecursively(el));
		}
		element.delete();
		delete courseElements.current[element.id];
		// courseElements.current = Object.fromEntries(
		// 	Object.entries(courseElements.current).filter(
		// 		([id, _]) => id !== element.id.toString(),
		// 	),
		// );
	};

	const loadSectionRecursively = async (element: CourseElement) => {
		if (!element.section) return;
		await loadSectionElements(element.section);
		element.section.elements.forEach(
			async el => await loadSectionRecursively(el),
		);
	};

	const canEdit = course.current?.creator.id === user?.id;

	const contextValue: CourseContextValues = {
		course: course.current,
		courseElements: courseElements,
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
				const courseLoaded: CourseModel = await api.db.courses.get({
					id,
				});
				course.current = courseLoaded;
				const elements = await api.db.courses.getElements({ courseId: id });

				elements.forEach(async el => {
					if (!course.current) {
						console.error('Something went wrong, not loading element ' + el);
						return;
					}
					el.course = course.current;
					courseElements.current[el.id] = el;
					el.initialize();
					await loadSectionRecursively(el);
				});
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
