import { useCallback, useContext, useRef, useState, useEffect } from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';
import { ACTIVITY_TYPE } from '../../../Models/Course/activity.entity';
import ActivityChallenge from './ActivityChallenge';
import RichTextEditor from '../../RichTextComponents/RichTextEditor/RichTextEditor';
import ButtonAdd from './ButtonAdd';
import { Descendant } from 'slate';
import { ActivityChallenge as ActivityChallengeModel } from '../../../Models/Course/activities/activity_challenge.entity';
import Button from '../../UtilsComponents/Buttons/Button';
import { useTranslation } from 'react-i18next';
import { ActivityVideo as ActivityVideoModel } from '../../../Models/Course/activities/activity_video.entity';
import { ActivityTheory as ActivityTheoryModel } from '../../../Models/Course/activities/activity_theory.entity';
import ActivityVideo from './ActivityVideo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActivityProps } from './activityTypes';
import FormInput from '../../UtilsComponents/FormInput/FormInput';
import ActivityTheory from './ActivityTheory';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import {
	faChevronLeft,
	faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

/**
 * Shows the opened activity. Renders different component depending on the type of the activity opened.
 *
 * @returns The activity currently opened. Shows the generic component and then the specific one depending
 *          on the type of the activity.
 *
 * @author Enric Soldevila, Mathis Laroche
 */
const Activity = ({ courseElement, editMode }: ActivityProps) => {
	const {
		course,
		setTab,
		updateActivity,
		setOpenModalImportResource,
		renameElement,
		removeResourceFromActivity,
		loadActivityResource,
		getPreviousActivity,
		getNextActivity,
	} = useContext(CourseContext);

	const activity = courseElement.activity;

	const { t } = useTranslation();
	const [isRenaming, setIsRenaming] = useState(false);
	const [loading, setLoading] = useState(!activity.resource);
	const inputRef = useRef<HTMLInputElement>();

	useEffect(() => {
		const load = async () => {
			setLoading(true);
			await loadActivityResource(activity);
			setLoading(false);
		};
		if (!activity.resource) load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const update = useCallback(
		(what: 'header' | 'footer') => {
			return async (value: Descendant[]) => {
				if (!courseElement) return;
				await updateActivity(activity, { [what]: value });
			};
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[courseElement, course],
	);

	/**
	 * Handles the renaming of an element
	 *
	 * @author Mathis Laroche
	 */
	const rename = async () => {
		if (isRenaming) {
			setIsRenaming(false);
		}
		if (
			inputRef.current?.value &&
			inputRef.current.value.trim() !== courseElement.name
		) {
			await renameElement(courseElement, inputRef.current.value.trim());
		}
	};

	if (!courseElement) {
		return <></>;
	}

	/**
	 * Renders the activity depending on its type
	 * @returns The specific activity depending on its type
	 */
	const renderSpecificActivity = () => {
		switch (activity.type) {
			case ACTIVITY_TYPE.CHALLENGE:
				return (
					<ActivityChallenge activity={activity as ActivityChallengeModel} />
				);
			case ACTIVITY_TYPE.THEORY:
				return <ActivityTheory activity={activity as ActivityTheoryModel} />;
			case ACTIVITY_TYPE.VIDEO:
				return <ActivityVideo activity={activity as ActivityVideoModel} />;
			default:
				return (
					<div className="w-full h-full flex justify-center items-center">
						Not implemented
					</div>
				);
		}
	};

	return (
		courseElement && (
			<div className="w-full h-full relative overflow-y-auto flex flex-col px-8">
				<div className="z-10 sticky top-0 pt-2 text-4xl bg-[color:var(--background-color)] pb-6 w-full border-[color:var(--bg-shade-four-color)]">
					<div className="flex items-center">
						<FontAwesomeIcon
							icon={activity.icon}
							className="m-0 mr-4 text-[color:var(--bg-shade-four-color)]"
						/>
						{isRenaming && editMode ? (
							<FormInput
								ref={inputRef as any}
								type="text"
								autoFocus
								onKeyPress={(event: KeyboardEvent) =>
									event.key.toLowerCase() === 'enter' && rename()
								}
								onFocus={() => {
									setIsRenaming(true);
								}}
								onBlur={rename}
								onDoubleClick={rename}
								className="bg-[color:var(--background-color)]"
								defaultValue={courseElement.name}
							/>
						) : (
							<strong
								onClick={() => editMode && setIsRenaming(true)}
								className={editMode ? 'cursor-pointer' : ''}
							>
								{courseElement.name}
							</strong>
						)}
					</div>
				</div>
				<div className="flex justify-center items-center">
					{activity.header !== null ? (
						<div className="text-sm pt-3 pb-3 w-full">
							<RichTextEditor
								readOnly={!editMode}
								onChange={update('header')}
								defaultText={activity.header}
							/>
						</div>
					) : (
						editMode && <ButtonAdd what="header" activity={activity} />
					)}
				</div>
				<div className="py-5">
					{activity.resource ? (
						<div className="flex flex-col items-center gap-4">
							{loading ? <LoadingScreen relative /> : renderSpecificActivity()}
							{editMode && (
								<Button
									variant="danger"
									onClick={() => removeResourceFromActivity(activity)}
								>
									{t('course.activity.remove_resource')}
								</Button>
							)}
						</div>
					) : (
						<div className="flex flex-col items-center gap-4">
							{editMode ? (
								<Button
									variant="primary"
									onClick={() => setOpenModalImportResource(true)}
								>
									{t('course.activity.import_resource')}
								</Button>
							) : (
								<div>{t('course.activity.empty')}</div>
							)}
						</div>
					)}
				</div>
				<div className="flex justify-center items-center">
					{activity.footer !== null ? (
						<div className="text-sm pt-3 w-full">
							<RichTextEditor
								readOnly={!editMode}
								onChange={update('footer')}
								defaultText={activity.footer}
							/>
						</div>
					) : (
						editMode && <ButtonAdd what="footer" activity={activity} />
					)}
				</div>
				<div className="flex flex-row items-center justify-evenly py-8">
					<div
						className="flex items-center gap-4 cursor-pointer"
						onClick={() =>
							setTab({
								openedActivity: getPreviousActivity(courseElement),
							})
						}
					>
						<FontAwesomeIcon size="1x" icon={faChevronLeft} />
						{t('course.activity.previous')}
					</div>
					<div
						className="flex items-center gap-4 cursor-pointer"
						onClick={() => {
							const act = getNextActivity(courseElement);
							console.log(act);
							setTab({
								openedActivity: act,
							});
						}}
					>
						{t('course.activity.next')}
						<FontAwesomeIcon size="1x" icon={faChevronRight} />
					</div>
				</div>
			</div>
		)
	);
};

export default Activity;
