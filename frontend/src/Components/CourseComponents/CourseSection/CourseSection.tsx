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
import { CourseSectionProps } from './courseSectionTypes';
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
		openActivity: loadActivity,
		addActivity,
		course,
		canEdit,
		deleteSection,
		deleteActivity,
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
			await section.getActivities(course.id);
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

					{canEdit &&
					(!section.activities || section.activities?.length === 0) ? (
						<Link
							dark
							onClick={() => {
								addActivity(
									section,
									plainToClass(Activity, {
										name: `Activity #${
											section.activities ? section.activities.length + 1 : 1
										}`,
									}),
								);
							}}
						>
							Add an activity
						</Link>
					) : (
						<>
							{section.activities?.map((a, idx) => (
								<div
									onClick={() =>
										a.id === activity?.id
											? closeCurrentActivity()
											: loadActivity(section, a)
									}
									key={idx}
									className="course-activity"
								>
									{a.id === activity?.id ? (
										<b style={{ color: 'var(--contrast-color)' }}>{a.name}</b>
									) : (
										a.name
									)}
									{canEdit && editMode && (
										<TDOption color="black" size="1x">
											<Option
												name="Rename"
												icon={faPenFancy}
												onClick={() => {}}
											/>
											<Option name="Move" icon={faDropbox} onClick={() => {}} />
											<Option
												name="Delete"
												icon={faTrash}
												onClick={() => {
													currentActivity.current = a;
													setConfirmActivityDelete(true);
												}}
												hoverColor="red"
											/>
										</TDOption>
									)}
								</div>
							))}
							{canEdit && (
								<Link
									dark
									onClick={() => {
										addActivity(
											section,
											plainToClass(Activity, {
												name: t('course.activity.new_name', {
													num: section.activities
														? section.activities.length + 1
														: 1,
												}),
											}),
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
					deleteSection(section);
				}}
				hideFooter
			></AlertConfirm>
			<AlertConfirm
				open={confirmActivityDelete}
				title={t('couse.activity.delete')}
				setOpen={setConfirmActivityDelete}
				onConfirm={() => {
					if (!(course && section && currentActivity.current)) return;
					deleteActivity(section, currentActivity.current);
				}}
				hideFooter
			></AlertConfirm>
		</Disclosure>
	);
};

export default CourseSection;
