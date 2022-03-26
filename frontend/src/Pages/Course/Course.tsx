import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { useAlert } from 'react-alert';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';
import CourseBody from '../../Components/CourseComponents/CourseBody/CourseBody';
import CourseLayout from '../../Components/CourseComponents/CourseLayout/CourseLayout';
import CourseNavigation from '../../Components/CourseComponents/CourseNavigation/CourseNavigation';
import CreateSectionMenu from '../../Components/CourseComponents/CourseSection/CreateSectionMenu';
import CreationActivityMenu from '../../Components/CourseComponents/CreationActivityMenu/CreationActivityMenu';
import FormInput from '../../Components/UtilsComponents/FormInput/FormInput';
import LoadingScreen from '../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import Modal from '../../Components/UtilsComponents/Modal/Modal';
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
import ResourceMenu from '../ResourceMenu/ResourceMenu';
import {
	CourseTabs,
	SwitchCourseTabActions,
	CourseTabState,
} from './courseTypes';
import useRoutes from '../../state/hooks/useRoutes';
import { useQuery } from '../../state/hooks/useQuery';
import { CourseElementActivity } from '../../Models/Course/course_element.entity';

/**
 * Course page that shows the content of a course
 *
 * @author Enric, Mathis
 */
const Course = () => {
	const { user } = useContext(UserContext);
	const { routes } = useRoutes();
	const { pathname } = useLocation();
	const query = useQuery();
	const course = useRef<CourseModel>();
	const courseElements = useRef<{
		[id: number]: CourseElement;
	}>({});
	const newCourseElementId = useRef<number>();
	const [isNavigationOpen, setIsNavigationOpen] = useState(true);
	const { id } = useParams<{ id: string }>();
	const [loading, setLoading] = useState(true);
	const { t } = useTranslation();
	const alert = useAlert();
	const navigate = useNavigate();
	const forceUpdate = useForceUpdate();
	const [openModalSection, setOpenModalSection] = useState(false);
	const [openModalActivity, setOpenModalActivity] = useState(false);
	const [openModalImportResource, setOpenModalImportResource] = useState(false);
	const [sectionParent, setSectionParent] = useState<Section>();
	const titleRef = useRef<HTMLInputElement>(null);
	const [courseTitle, setCourseTitle] = useState(course.current?.name);
	const [editTitle, setEditTitle] = useState(false);
	const [tab, setTab] = useReducer(
		(state: CourseTabState, action: SwitchCourseTabActions): CourseTabState => {
			if (!course.current) return state;

			console.log(action.openedActivity);

			if (action.openedActivity != null)
				query.set('act', action.openedActivity.id.toString());
			// Do not replace the else if for an else
			else if (action.openedActivity === null) {
				query.delete('act');
				if (!action.tab) navigate({ search: query.toString() });
			}

			switch (action.tab) {
				case 'view':
					navigate({
						pathname:
							routes.auth.course.path.replace(':id', course.current.id) +
							'/view',
						search: query.toString(),
					});
					break;
				case 'layout':
					navigate({
						pathname:
							routes.auth.course.path.replace(':id', course.current.id) +
							'/layout',
						search: query.toString(),
					});
					break;
			}

			return {
				tab: action.tab ?? state.tab,
				openedActivity:
					action.openedActivity !== undefined
						? action.openedActivity
						: state.openedActivity,
			};
		},
		{
			tab: 'view',
		},
	);

	useEffect(() => {
		if (pathname.endsWith('layout') && tab.tab !== 'layout')
			setTab({ tab: 'layout' });
		else if (pathname.endsWith('view') && tab.tab !== 'view')
			setTab({ tab: 'view' });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	/**
	 * Gets the first activity inside an array of elements.
	 *
	 * @returns The first activity found or null there are no activities
	 * @author Enric Soldevila
	 */
	const getFirstActivity = (elements: CourseElement[]) => {
		const getRecursively = (
			courseElement: CourseElement,
		): CourseElementActivity | null => {
			if (courseElement.activity) return courseElement as CourseElementActivity;
			if (courseElement.section) {
				if (courseElement.section.elements.length <= 0) return null;
				return getRecursively(courseElement.section.elements[0]);
			}
			return null;
		};
		if (elements.length <= 0) return null;
		return getRecursively(elements[0]);
	};

	/**
	 * Indicates if the element was just added (is new)
	 *
	 * @param element Element that wants to know if it is new or not
	 * @author Mathis Laroche
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
	 * @author Mathis Laroche
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
	 * @author Mathis Laroche
	 */
	const openSectionForm = (sectionParent?: Section) => {
		setSectionParent(sectionParent);
		setOpenModalSection(true);
	};

	/**
	 * Sets the state of the activity creation modal to true
	 *
	 * @param sectionParent the section in which we create this new activity
	 * @author Mathis Laroche
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
	 * @author Mathis Laroche
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
		forceUpdate();
	};

	/**
	 * Deletes and removes an element in the course
	 *
	 * @param element the element to delete from the course
	 * @author Mathis Laroche
	 */
	const deleteElement = async (element: CourseElement) => {
		if (!course.current || !courseElements.current) return;
		await api.db.courses.deleteElement({
			courseId: course.current.id,
			elementId: element.id.toString(),
		});
		deleteElementRecursively(element);

		forceUpdate();
	};

	/**
	 * Loads the elements contained in a section
	 *
	 * @param section the section you want to load the elements
	 * @author Mathis Laroche
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
		forceUpdate();
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
		forceUpdate();
	};

	type keyofActivity = {
		[name in keyof Activity]?: Activity[name];
	};
	const updateActivity = async (activity: Activity, fields: keyofActivity) => {
		if (!activity || !course.current) return;
		await api.db.courses.updateActivity(
			{
				courseId: course.current.id,
				activityId: activity.id.toString(),
			},
			fields,
		);
		Object.assign(activity, fields);
		forceUpdate();
	};

	/**
	 * Deletes the element passed in argument. If the element is a section,
	 * it will also deletes its children, and so on, recursively.
	 *
	 * @param element The element to delete
	 * @author Mathis Laroche
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
	 * @author Mathis Laroche
	 */
	const loadSectionRecursively = async (element: CourseElement) => {
		// FIXME some elements are loaded twice

		if (!element.section) return;
		await loadSectionElements(element.section);
		for (const el of element.section.elements) {
			await loadSectionRecursively(el);
		}
	};

	/**
	 * Removes the resource of an activity with the request to the backend.
	 *
	 * @param activity Activity to remove the resource from
	 * @returns void
	 */
	const removeResourceFromActivity = async (activity: Activity) => {
		if (!course.current) return;
		await api.db.courses.removeResourceFromActivity({
			id: course.current.id,
			activityId: activity.id.toString(),
		});
		activity.resource = undefined;
		forceUpdate();
	};

	const loadActivityResource = async (activity: Activity) => {
		if (!course.current) return;
		activity.resource = await api.db.courses.getActivityResource({
			courseId: course.current.id,
			activityId: activity.id.toString(),
		});
	};

	const canEdit = course.current?.creator.id === user?.id;

	const contextValue: CourseContextValues = {
		course: course.current,
		courseElements: courseElements,
		setCourseElementNotNew,
		isNewCourseElement,
		canEdit,
		isNavigationOpen,
		tab,
		setTab,
		renameElement,
		setTitle,
		addContent,
		loadSectionElements,
		setIsNavigationOpen,
		deleteElement,
		moveElement: async (..._) => {},
		updateActivity,
		openActivityForm,
		openSectionForm,
		setOpenModalImportResource,
		removeResourceFromActivity,
		loadActivityResource,
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

				// Loading all elements recursively
				for (const el of elements) {
					el.course = course.current;
					courseElements.current[el.id] = el;
					el.initialize();
					await loadSectionRecursively(el);
				}

				// Get saved opened activity inside the url params
				const savedOpenedActivityId = query.get('act');
				let savedOpenedActivity: CourseElementActivity | undefined;
				if (
					savedOpenedActivityId &&
					Number(savedOpenedActivityId) in courseElements.current
				) {
					const el = courseElements.current[Number(savedOpenedActivityId)];
					if (el.activity) savedOpenedActivity = el as CourseElementActivity;
				}

				// If there is a saved opened activity opens it
				if (savedOpenedActivity)
					setTab({ openedActivity: savedOpenedActivity });
				// Otherwise, open the first activity
				else {
					const firstActivity = getFirstActivity(elements);
					if (firstActivity) setTab({ openedActivity: firstActivity });
				}

				// Updating the state
				course.current.elements = elements;
				setCourseTitle(course.current.name);
				forceUpdate();
				setLoading(false);
			} catch (err) {
				navigate(-1);
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
									onClick={() => canEdit && setEditTitle(true)}
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
				) : tab.tab === 'layout' ? (
					<CourseLayout />
				) : (
					<div className="flex w-full h-full overflow-y-auto">
						<div className="w-1/4 h-full overflow-y-auto">
							<CourseNavigation />
						</div>
						<div className="w-3/4 h-full overflow-y-auto relative">
							<CourseBody />
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
			<Modal
				title={t('course.resource.import')}
				size="xl"
				setOpen={setOpenModalImportResource}
				open={openModalImportResource}
			>
				<ResourceMenu
					mode="import"
					onSelectResource={async resource => {
						if (
							!course.current ||
							!tab.openedActivity ||
							!tab.openedActivity.activity
						)
							return;
						await api.db.courses.addResourceInActivity(
							course.current,
							tab.openedActivity.activity,
							resource,
						);
						(tab.openedActivity.activity as Activity).resource = resource;
						setOpenModalImportResource(false);
					}}
				/>
			</Modal>
		</CourseContext.Provider>
	);
};

export default Course;
