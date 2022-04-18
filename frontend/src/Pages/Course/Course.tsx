import {
	useContext,
	useEffect,
	useReducer,
	useRef,
	useState,
	useCallback,
} from 'react';
import { useAlert } from 'react-alert';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';
import CourseBody from '../../Components/CourseComponents/CourseBody/CourseBody';
import CourseLayout from '../../Components/CourseComponents/CourseLayout/CourseLayout';
import CourseNavigation from '../../Components/CourseComponents/CourseNavigation/CourseNavigation';
import CreateSectionMenu from '../../Components/CourseComponents/CourseSection/CreateSectionMenu';
import MenuActivityCreation from '../../Components/CourseComponents/MenuActivityCreation/MenuActivityCreation';
import FormInput from '../../Components/UtilsComponents/FormInput/FormInput';
import LoadingScreen from '../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import Modal from '../../Components/UtilsComponents/Modal/Modal';
import api from '../../Models/api';
import { Activity } from '../../Models/Course/activity.entity';
import { Course as CourseModel } from '../../Models/Course/course.entity';
import {
	CourseContent,
	CourseElement,
	CourseParent,
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
import { SwitchCourseTabActions, CourseTabState } from './courseTypes';
import useRoutes from '../../state/hooks/useRoutes';
import { useQuery } from '../../state/hooks/useQuery';
import {
	CourseElementActivity,
	CourseElementSection,
} from '../../Models/Course/course_element.entity';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSkull } from '@fortawesome/free-solid-svg-icons';
import { plainToInstance } from 'class-transformer';

/**
 * Course page that shows the content of a course
 *
 * @author Enric Soldevila, Mathis Laroche
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
	const [courseNavigationOpen, setCourseNavigationOpen] = useState(true);
	const [isCursed, setIsCursed] = useState(false);

	/**
	 * Check if the current logged in user is the creator of the course
	 *
	 * @returns true if the user is the creator, false otherwise
	 * @author Enric Soldevila
	 */
	const isCreator = () => {
		return user?.id === course.current?.creator.id;
	};

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
	const getFirstActivity = (parent: CourseParent) => {
		if (!parent.elements || !parent.elementsOrder) return null;
		const getRecursively = (
			courseElement: CourseElement,
		): CourseElementActivity | null => {
			if (courseElement.activity) return courseElement as CourseElementActivity;
			if (courseElement.section) {
				if (courseElement.section?.elementsOrder.length <= 0) return null;
				const firstEl = courseElement.section.elements.find(
					el => el.id === courseElement.section?.elementsOrder[0],
				);
				if (!firstEl) return null;
				return getRecursively(firstEl);
			}
			return null;
		};
		if (parent.elementsOrder.length <= 0) return null;
		const firstEl = parent.elements.find(
			el => el.id === parent.elementsOrder[0],
		);
		if (!firstEl) return null;
		return getRecursively(firstEl);
	};

	/**
	 * Gets the last activity inside an array of elements.
	 *
	 * @returns The last activity found or null there are no activities
	 * @author Enric Soldevila
	 */
	const getLastActivity = (parent: CourseParent) => {
		const getRecursively = (
			courseElement: CourseElement,
		): CourseElementActivity | null => {
			if (courseElement.activity) return courseElement as CourseElementActivity;
			if (courseElement.section) {
				if (courseElement.section?.elementsOrder.length <= 0) return null;
				const firstEl = courseElement.section.elements.find(
					el =>
						el.id ===
						courseElement.section?.elementsOrder[
							courseElement.section.elementsOrder.length - 1
						],
				);
				if (!firstEl) return null;
				return getRecursively(firstEl);
			}
			return null;
		};
		if (parent.elementsOrder.length <= 0) return null;
		const lastEl = parent.elements.find(
			el => el.id === parent.elementsOrder[parent.elementsOrder.length - 1],
		);
		if (!lastEl) return null;
		return getRecursively(lastEl);
	};

	/**
	 * Reducer function used to reduce the state complexity of the CourseContext.
	 * All the method for navigating and storing the current state of the page
	 * after a refresh is done here (openedActivity, openedTab, openedSections)
	 *
	 * @author Enric Soldevila
	 */
	const TabReducer = (
		state: CourseTabState,
		action: SwitchCourseTabActions,
	): CourseTabState => {
		if (!course.current) return state;

		let openedSections = (query.get('sec')?.split(',') ?? []).reduce(
			(elements: CourseElementSection[], el: string) => {
				if (Number(el) in courseElements.current) {
					const foundSection = courseElements.current[Number(el)];
					if (foundSection.isSection) {
						elements.push(foundSection as CourseElementSection);
					}
				}
				return elements;
			},
			[],
		);
		if (action.openedActivity != null) {
			const openParentSection = (element: CourseElement) => {
				const parentSection = element.getParent();
				if (parentSection instanceof Section) {
					const parent = parentSection.courseElement;
					if (!openedSections.find(sec => sec === parent))
						openedSections.push(parent);
					if (parent.sectionParent)
						openParentSection((element.getParent() as Section).courseElement);
				}
			};
			openParentSection(action.openedActivity);
			query.set('act', action.openedActivity.id.toString());
		}
		// Do not replace the else if for an else
		else if (action.openedActivity === null) query.delete('act');

		if (action.tab === 'view' && state.tab !== 'view' && !query.has('act'))
			action.openedActivity = getFirstActivity(course.current);

		if (action.openSection) {
			if (openedSections.length <= 0)
				query.set('sec', action.openSection.id.toString());
			else if (!openedSections.includes(action.openSection))
				openedSections.push(action.openSection);
		}

		if (action.closeSection) {
			openedSections = openedSections.filter(
				sec => sec !== action.closeSection,
			);
		}

		if (openedSections.length <= 0) query.delete('sec');
		else query.set('sec', openedSections.map(s => s.id).join(','));

		const tab = action.tab ?? state.tab;
		switch (tab) {
			case 'view':
				navigate({
					pathname:
						routes.auth.course.path.replace(':id', course.current.id) + '/view',
					search: query.toString(),
				});
				break;
			case 'layout':
				navigate({
					pathname:
						routes.auth.course.path.replace(':id', course.current.id) +
						(isCreator() ? '/layout' : 'view'),
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
			openedSections,
		};
	};

	const [tab, setTab] = useReducer(TabReducer, {
		tab: 'view',
		openedSections: [],
	});

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
	 * Gets the next activity in the course starting from an activity.
	 *
	 * @returns The next activity found or null there are no activities
	 * @author Enric Soldevila
	 */
	const getNextActivity = useCallback((element: CourseElement) => {
		const getRecursively = (
			el: CourseElement,
		): CourseElementActivity | null => {
			const parent = el.getParent();
			const index = parent.elementsOrder.indexOf(el.id);
			if (index + 1 >= parent.elementsOrder.length) {
				if (parent instanceof CourseModel) return null;
				return getRecursively(parent.courseElement);
			}
			const nextElement = parent.elements.find(
				el => el.id === parent.elementsOrder[index + 1],
			);
			if (!nextElement) return null;
			if (nextElement.isActivity)
				return courseElements.current[nextElement.id] as CourseElementActivity;
			return getFirstActivity((nextElement as CourseElementSection).section);
		};
		return getRecursively(element);
	}, []);

	/**
	 * Gets the previous activity in the course starting from an activity.
	 *
	 * @returns The previous activity found or null there are no activities
	 * @author Enric Soldevila
	 */
	const getPreviousActivity = useCallback((element: CourseElement) => {
		const getRecursively = (
			el: CourseElement,
		): CourseElementActivity | null => {
			const parent = el.getParent();
			const index = parent.elementsOrder.indexOf(el.id);
			if (index - 1 < 0) {
				if (parent instanceof CourseModel) return null;
				return getRecursively(parent.courseElement);
			}
			const nextElement = parent.elements.find(
				el => el.id === parent.elementsOrder[index - 1],
			);
			if (!nextElement) return null;
			if (nextElement.isActivity)
				return courseElements.current[nextElement.id] as CourseElementActivity;
			return getLastActivity((nextElement as CourseElementSection).section);
		};
		return getRecursively(element);
	}, []);

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

	const setIsElementVisible = async (
		element: CourseElement,
		isVisible: boolean,
	) => {
		if (
			!course.current ||
			element.isVisible === isVisible ||
			!courseElements.current
		)
			return;

		(
			await api.db.courses.updateElement(
				course.current.id,
				element.id.toString(),
				{ isVisible },
			)
		).forEach(el => {
			courseElements.current[el.id].isVisible = isVisible;
		});
		forceUpdate();
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
		console.log(course.current);
		const { courseElement, newOrder } = await api.db.courses
			.addContent(course.current.id, content, name, sectionParent?.id)
			.catch(e => {
				setIsCursed(true);
				throw e;
			});

		courseElement.initialize(course.current, sectionParent);
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
			courseElements.current[el.id] = el;
			if (!course.current) throw Error('No course currently set');
			course.current && el.initialize(course.current, section);
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
			course.current.id,
			element.id.toString(),
			{ name: newName },
		);
		forceUpdate();
	};

	type keyofActivity = {
		[name in keyof Activity]?: Activity[name];
	};

	/**
	 * Method to update any type of activity
	 * @param activity Activity to update
	 * @param fields Fields to update the activity with
	 */

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
	 * @author Enric Soldevila
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

	/**
	 * Loads from the backend the resource contained inside an activity.
	 *
	 * @param activity The activity to load the resource of
	 * @returns The activity contained inside the activity
	 * @author Enric Soldevila
	 */
	const loadActivityResource = async (activity: Activity) => {
		if (!course.current) return;
		activity.resource = await api.db.courses.getActivityResource({
			courseId: course.current.id,
			activityId: activity.id.toString(),
		});
	};

	const moveElement = async (
		element: CourseElement,
		newIdx: number,
		newParent: CourseParent,
	) => {
		if (!course.current) return;
		if (
			element.isSection &&
			newParent instanceof Section &&
			element === newParent.courseElement
		)
			return;

		const { newOrder, oldOrder } = await api.db.courses.moveElement(
			course.current.id,
			{
				elementId: element.id.toString(),
				index: newIdx,
				parentId: newParent.id.toString(),
			},
		);

		element.parent.elementsOrder = oldOrder;
		newParent.elementsOrder = newOrder;

		// if (element.parent instanceof Section) {
		// 	courseElements.current[element.parent.courseElement.id] =
		// 		element.parent.courseElement;
		// } else {
		// 	course.current.elements = course.current.elements.filter(
		// 		e => e.id !== element.id,
		// 	);
		// }
		element.parent = newParent;
		// courseElements.current[element.id] = element;
		forceUpdate();
	};

	/** Values for the course context used by the other components inside of it */
	const contextValue: CourseContextValues = {
		course: course.current,
		courseElements: courseElements,
		setCourseElementNotNew,
		isNewCourseElement,
		isNavigationOpen,
		tab,
		setTab,
		renameElement,
		setIsElementVisible,
		setTitle,
		addContent,
		loadSectionElements,
		setIsNavigationOpen,
		deleteElement,
		moveElement,
		updateActivity,
		openActivityForm,
		openSectionForm,
		setOpenModalImportResource,
		removeResourceFromActivity,
		loadActivityResource,
		getNextActivity,
		getPreviousActivity,
		isCreator,
	};

	/**
	 * This is where the course is loaded from the database
	 * @author Mathis Laroche, Enric Soldevila
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
					courseElements.current[el.id] = el;
					el.initialize(course.current);
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
				else if (pathname.endsWith('view')) {
					course.current.elements = Object.values(courseElements.current);
					const firstActivity = getFirstActivity(course.current);
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
			{isCursed && (
				<div className="flex flex-row bg-red-600 text-white text-center justify-center">
					<h2 className="text-2xl">Your course is cursed</h2>
					<FontAwesomeIcon icon={faSkull} className="ml-2 text-white mt-2" />
				</div>
			)}
			<div className="w-full h-full flex flex-col bg-[color:var(--background-color)] text-[color:var(--foreground-color)]">
				<div className="border-b border-[color:var(--bg-shade-four-color)]">
					<div className="text-4xl text-left text-[color:var(--foreground-color)] pl-5 pt-3 pb-3">
						{isCreator() ? (
							<div className="flex flex-row justify-between items-center">
								{editTitle ? (
									<FormInput
										ref={titleRef}
										type="text"
										autoFocus
										onBlur={async () => {
											if (!titleRef.current) return;
											await setTitle(titleRef.current.value);
											setCourseTitle(titleRef.current.value);
											setEditTitle(false);
										}}
										defaultValue={courseTitle}
									/>
								) : (
									<span
										style={{ cursor: isCreator() ? 'pointer' : 'auto' }}
										onClick={() => isCreator() && setEditTitle(true)}
									>
										{courseTitle}
									</span>
								)}{' '}
								<label className="pr-3 text-2xl opacity-60">
									{tab.tab === 'layout'
										? t('course.layout_view')
										: t('course.student_view')}
								</label>
							</div>
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
						<div
							className={
								(courseNavigationOpen ? 'w-1/4' : 'w-auto') +
								' h-full overflow-y-auto'
							}
						>
							<CourseNavigation
								onToggle={() => setCourseNavigationOpen(!courseNavigationOpen)}
								startsOpen={courseNavigationOpen}
							/>
						</div>
						<div
							className={
								(courseNavigationOpen ? 'w-3/4' : 'w-full') +
								' h-full overflow-y-auto relative'
							}
						>
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
			<MenuActivityCreation
				open={openModalActivity}
				setOpen={setOpenModalActivity}
				sectionParent={sectionParent}
			/>
			<Modal
				title={t('course.activity.import_resource')}
				size="xl"
				setOpen={setOpenModalImportResource}
				open={openModalImportResource}
			>
				<ResourceMenu
					mode="import"
					filters={tab.openedActivity?.activity.allowedResources}
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
