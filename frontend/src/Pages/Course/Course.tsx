import { useContext, useEffect, useRef, useState } from 'react';
import { useAlert } from 'react-alert';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CourseLayout from '../../Components/CourseComponents/CourseLayout/CourseLayout';
import FillContainer from '../../Components/UtilsComponents/FillContainer/FillContainer';
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

const StyledDiv = styled.div`
	display: flex;
	width: 100%;
	.course-body {
	}
`;

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
	const { id } = useParams<{ id: string }>();

	const { t } = useTranslation();
	const alert = useAlert();
	const navigate = useNavigate();
	const update = useForceUpdate();

	/**
	 * Sets the course's title to a new one
	 *
	 * @param newTitle The new title of the course
	 * @author Mathis
	 */
	const setTitle = async (newTitle: string) => {
		if (!course.current) return;
		const courseDTO = { ...course, name: newTitle, code: undefined };

		const updatedCourse = await api.db.courses.update(
			{ id: course.current.id },
			courseDTO,
		);
		course.current.name = updatedCourse.name;

		course.current = updatedCourse;
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
		const parent = sectionParent ?? course.current;
		parent.elementsOrder = newOrder;
		parent.elements.push(courseElement);

		// if the content is added directly at the level of the course
		console.log(courseElement);

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
		console.log(res);

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
			courseElements.current[el.id] = el;
		});
		console.log(elements);

		section.elements = elements;
		update();
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

	// const saveActivityContent = async (data: string) => {
	// 	if (!course || !activity || !section) return;
	// 	const activityDTO = { ...activity, content: { data } };
	// 	(activityDTO as any).levels = undefined;

	// 	const updatedAct = await api.db.courses.updateActivity(
	// 		{
	// 			courseId: course.id,
	// 			sectionId: section.id.toString(),
	// 			activityId: activity.id.toString(),
	// 		},
	// 		activityDTO,
	// 	);

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

	// const addSection = (section: Section) => {
	// 	if (!course) return;
	// 	course.sections.push(section);
	// 	setCourse(plainToClass(CourseModel, course));
	// };

	// const deleteSection = async (section: Section) => {
	// 	if (!course) return;

	// 	await api.db.courses.deleteSection({
	// 		courseId: course.id,
	// 		sectionId: section.id.toString(),
	// 	});
	// 	course.sections = course.sections.filter(
	// 		_section => _section.id !== section.id,
	// 	);
	// 	setCourse(plainToClass(CourseModel, course));
	// };

	// const addActivity = async (section: Section, newAct: Activity) => {
	// if (!course) return;
	// newAct = await api.db.courses.addActivity(course?.id, section.id, newAct);
	// const sectionFound = course?.sections.find(s => s.id === section.id);
	// if (!sectionFound || !course) return;
	// course.sections = course?.sections.map(s => {
	// 	if (s.id === sectionFound.id)
	// 		s.activities ? s.activities.push(newAct) : (s.activities = [newAct]);
	// 	return s;
	// });
	// loadActivity(section, newAct);
	// setCourse(plainToClass(CourseModel, course));
	// };

	// const deleteActivity = async (section: Section, _activity: Activity) => {
	// 	if (!(course && course.sections)) return;

	// 	await api.db.courses.deleteActivity({
	// 		courseId: course.id,
	// 		sectionId: section.id.toString(),
	// 		activityId: _activity.id.toString(),
	// 	});
	// 	const idx = course.sections.indexOf(section);

	// 	course.sections[idx].activities = (
	// 		await section.getActivities(course.id)
	// 	)?.filter(_activity_ => _activity_.id !== _activity.id);
	// 	if (_activity.id === activity?.id) {
	// 		setActivity(undefined);
	// 	}

	// 	setCourse(plainToClass(CourseModel, course));
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
		setTitle,
		addContent,
		loadSectionElements,
		// loadActivity,
		// closeCurrentActivity,
		// saveActivity,
		// saveActivityContent,
		setIsNavigationOpen,
		deleteElement,
		moveElement: (..._) => {},
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
			<StyledDiv>
				<FillContainer className="course-body">
					{/*<CourseNavigation />
					<ActivityContent />*/}
					<CourseLayout />
				</FillContainer>
			</StyledDiv>
		</CourseContext.Provider>
	);
};

export default Course;
