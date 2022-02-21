import { plainToClass } from 'class-transformer';
import { useContext, useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CourseTester from '../../Components/CourseComponents/CourseStructure/CourseTester';
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
	const [course, setCourse] = useState<CourseModel>();
	const [courseElements, setCourseElements] = useState<{
		[id: number]: CourseElement;
	}>();
	const [section, setSection] = useState<Section>();
	const [activity, setActivity] = useState<Activity>();
	const [isNavigationOpen, setIsNavigationOpen] = useState(true);
	const { id } = useParams<{ id: string }>();

	const { t } = useTranslation();
	const alert = useAlert();
	const navigate = useNavigate();

	const setTitle = async (newTitle: string) => {
		if (!course) return;
		const courseDTO = { ...course, name: newTitle, code: undefined };

		const updatedCourse = await api.db.courses.update(
			{ id: course.id },
			courseDTO,
		);
		course.name = updatedCourse.name;

		setCourse(course);
	};

	const addContent = async (
		content: CourseContent,
		sectionParent?: Section,
	) => {
		if (!course || !courseElements) return;

		const { courseElement, parent, newOrder } = await api.db.courses.addContent(
			course.id,
			content,
			sectionParent?.id,
		);
		parent.elements_order = newOrder;
		parent.elements.push(courseElement);

		// if the content is added directly at the level of the course
		if (parent instanceof CourseModel) {
			setCourse(plainToClass(CourseModel, course));
		}
		// if the content is added in a section
		else if (parent instanceof Section) {
			setCourseElements({
				...courseElements,
				[parent.id]: parent.course_element,
			});
		}
	};

	const deleteElement = async (element: CourseElement) => {
		if (!course || !courseElements) return;

		await api.db.courses.deleteElement({
			course_id: course.id,
			element_id: element.id.toString(),
		});
		if (element.courseParent) {
			element.courseParent.elements_order =
				element.courseParent.elements_order.filter(el => el !== element.id);
			element.courseParent.elements = element.courseParent.elements.filter(
				el => el.id !== element.id,
			);
			setCourse(plainToClass(CourseModel, course));
		} else if (element.sectionParent) {
			element.sectionParent.elements_order =
				element.sectionParent.elements_order.filter(el => el !== element.id);
			element.sectionParent.elements = element.sectionParent.elements.filter(
				el => el.id !== element.id,
			);
			setCourseElements(
				Object.fromEntries(
					Object.entries(courseElements).filter(
						([_, el]) => el.id !== element.id,
					),
				),
			);
		}
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

	const canEdit = course?.creator.id === user?.id;

	const contextValue: CourseContextValues = {
		course,
		section,
		activity,
		courseElements,
		canEdit,
		isNavigationOpen,
		setTitle,
		addContent,
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

	useEffect(() => {
		if (!id) return;
		const getCourse = async () => {
			try {
				const course: CourseModel = await api.db.courses.get({
					id,
				});
				// await course.getSections();
				setCourse(course);
			} catch (err) {
				navigate('/');
				return alert.error(t('error.not_found', { obj: t('msg.course') }));
			}
		};
		getCourse();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, user]);

	if (!course) return <></>;
	return (
		<CourseContext.Provider value={contextValue}>
			<StyledDiv>
				<FillContainer className="course-body">
					{/*<CourseNavigation />
					<ActivityContent />*/}
					<CourseTester />
				</FillContainer>
			</StyledDiv>
		</CourseContext.Provider>
	);
};

export default Course;
