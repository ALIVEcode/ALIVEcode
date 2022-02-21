import { faDropbox } from '@fortawesome/free-brands-svg-icons';
import { faPenFancy, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Disclosure } from '@headlessui/react';
import { plainToClass } from 'class-transformer';
import { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity } from '../../../Models/Course/activity.entity';
import { CourseContext } from '../../../state/contexts/CourseContext';
import AlertConfirm from '../../UtilsComponents/Alert/AlertConfirm/AlertConfirm';
import Link from '../../UtilsComponents/Link/Link';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import { Option, TDOption } from '../../UtilsComponents/Option/TDOption';
import { CourseSectionProps } from '../CourseSection/courseSectionTypes';
/**
 * Component that shows the section in the navigation and handles different actions like adding in an activity onto the section
 *
 * @param {Section} section
 * @author MoSk3
 * @author Ecoral360
 */
const CourseSection = ({ section, editMode }: CourseSectionProps) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const {
		loadActivity,
		deleteElement,
		addContent,
		courseElements,
		course,
		canEdit,
		activity,
		closeCurrentActivity,
	} = useContext(CourseContext);
	const { t } = useTranslation();
	const [confirmSectionDelete, setConfirmSectionDelete] = useState(false);
	const [confirmActivityDelete, setConfirmActivityDelete] = useState(false);
	const currentActivity = useRef<Activity>();

	const toggleOpenSection = async () => {
		if (!course) return;
		setOpen(!open);
		if (!open) {
			setLoading(true);
			await section.elements;
			setLoading(false);
		}
	};

	return (
		<Disclosure as="div" className="course-section">
			<Disclosure.Button
				as="div"
				className="course-section-header"
				aria-controls={`section-${section.name}`}
				aria-expanded={open}
			>
				<div className="course-section-header-edit">
					<span onClick={toggleOpenSection}>{section.name}</span>
					{canEdit && editMode && (
						<TDOption color="black" size="1x">
							<Option name="Rename" icon={faPenFancy} onClick={() => {}} />
							<Option name="Move" icon={faDropbox} onClick={() => {}} />
							<Option
								name="Delete"
								icon={faTrash}
								onClick={() => setConfirmSectionDelete(true)}
								hoverColor="red"
							/>
						</TDOption>
					)}
				</div>
			</Disclosure.Button>
			<Disclosure.Panel>
				<div id={`section-${section.name}`} className="course-section-body">
					{loading && open && <LoadingScreen size="3x" relative />}

					{canEdit && (!section.elements || section.elements?.length === 0) ? (
						<Link
							dark
							onClick={() => {
								addContent(
									plainToClass(Activity, {
										name: `Activity #${
											section.elements ? section.elements.length + 1 : 1
										}`,
									}),
									section,
								);
							}}
						>
							Add an activity
						</Link>
					) : (
						<>
							{section.elements?.map((a, idx) => (
								<div key={idx} className="course-activity">
									{a.id === activity?.id ? (
										<b style={{ color: 'var(--contrast-color)' }}>
											{a.getName()}
										</b>
									) : (
										a.getName()
									)}
								</div>
							))}
							{canEdit && (
								<Link
									dark
									onClick={() => {
										addContent(
											plainToClass(Activity, {
												name: t('course.activity.new_name', {
													num: section.elements
														? section.elements.length + 1
														: 1,
												}),
											}),
											section,
										);
									}}
								>
									{t('course.activity.new')}
								</Link>
							)}
						</>
					)}
				</div>
			</Disclosure.Panel>
			<AlertConfirm
				open={confirmSectionDelete}
				title={t('couse.section.delete')}
				setOpen={setConfirmSectionDelete}
				onConfirm={() => {
					if (!(course && section)) return;
					deleteElement(section.course_element);
				}}
				hideFooter
			></AlertConfirm>
			<AlertConfirm
				open={confirmActivityDelete}
				title={t('couse.activity.delete')}
				setOpen={setConfirmActivityDelete}
				onConfirm={() => {
					if (!(course && section && currentActivity.current)) return;
					deleteElement(currentActivity.current.course_element);
				}}
				hideFooter
			></AlertConfirm>
		</Disclosure>
	);
};

export default CourseSection;
