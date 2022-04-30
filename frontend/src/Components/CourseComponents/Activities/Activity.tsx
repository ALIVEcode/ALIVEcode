import {
	useCallback,
	useContext,
	useRef,
	useState,
	useEffect,
	useMemo,
} from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';
import { ACTIVITY_TYPE } from '../../../Models/Course/activity.entity';
import ActivityChallenge from './ActivityChallenge';
import RichTextEditor from '../../RichTextComponents/RichTextEditor/RichTextEditor';
import ButtonAdd from './ButtonAdd';
import { Descendant } from 'slate';
import Button from '../../UtilsComponents/Buttons/Button';
import { useTranslation } from 'react-i18next';
import ActivityVideo from './ActivityVideo';
import ActivityPdf from './ActivityPdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActivityProps } from './activityTypes';
import FormInput from '../../UtilsComponents/FormInput/FormInput';
import ActivityAssignment from './ActivityAssignment';
import ActivityTheory from './ActivityTheory';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import { classNames } from '../../../Types/utils';
import {
	faChevronLeft,
	faChevronRight,
	faMinusCircle,
} from '@fortawesome/free-solid-svg-icons';
import { ActivityVideo as ActivityVideoModel } from '../../../Models/Course/activities/activity_video.entity';
import { ActivityPdf as ActivityPdfModel } from '../../../Models/Course/activities/activity_pdf.entity';
import { ActivityAssignment as ActivityAssignmentModel } from '../../../Models/Course/activities/activity_assignment.entity';
import { RESOURCE_TYPE } from '../../../Models/Resource/resource.entity';
import { UserContext } from '../../../state/contexts/UserContext';
import api from '../../../Models/api';
import InputGroup from '../../UtilsComponents/InputGroup/InputGroup';
import { parseVideoURL } from './ActivityVideo';

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
		tab,
		setTab,
		updateActivity,
		setOpenModalImportResource,
		renameElement,
		removeResourceFromActivity,
		loadActivityResource,
		getPreviousActivity,
		getNextActivity,
		forceUpdateCourse,
	} = useContext(CourseContext);

	const activity = courseElement.activity;

	const { t } = useTranslation();
	const { createResource } = useContext(UserContext);
	const [isRenaming, setIsRenaming] = useState(false);
	const [loading, setLoading] = useState(!activity.resource);
	const [selectedFile, setSelectedFile] = useState<File>();
	const [videoUrl, setVideoUrl] = useState<string | undefined | null>(
		undefined,
	);
	const [isInvalidURL, setIsInvalidURL] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const inputFileRef = useRef<HTMLInputElement>(null);

	const previousActivity = useMemo(
		() => getPreviousActivity(courseElement),
		[courseElement, getPreviousActivity],
	);
	const nextActivity = useMemo(
		() => getNextActivity(courseElement),
		[courseElement, getNextActivity],
	);

	/**
	 * Loads the resource inside the activity
	 * @author Enric Soldevila
	 */
	useEffect(() => {
		const load = async () => {
			setLoading(true);
			await loadActivityResource(activity);
			setLoading(false);
		};
		if (!activity.resource) load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/**
	 * Updates the header or footer of the activity
	 * @author Mathis Laroche
	 */
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

	useEffect(() => {
		if (selectedFile && course) {
			const createResourceWithFile = async () => {
				const resourceType = activity.allowedResources[0];
				let createdRes;
				switch (activity.type) {
					case ACTIVITY_TYPE.PDF:
					case ACTIVITY_TYPE.VIDEO:
					case ACTIVITY_TYPE.ASSIGNMENT:
						createdRes = await createResource({
							file: selectedFile,
							type: resourceType,
							resource: { name: selectedFile.name, subject: course?.subject },
						});
				}
				if (!createdRes) return;
				activity.resource = createdRes;
				await api.db.courses.addResourceInActivity(
					course,
					activity,
					activity.resource,
				);
				forceUpdateCourse();
			};
			createResourceWithFile();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedFile]);

	/**
	 * When the URL input from a resource video creation changes, validate
	 * the url and create the resource
	 */
	useEffect(() => {
		if (!course) return;
		const resourceType = activity.allowedResources[0];
		if (videoUrl && resourceType === RESOURCE_TYPE.VIDEO) {
			const matches = parseVideoURL(videoUrl);
			if (!matches) return setIsInvalidURL(true);

			const createResourceWithURL = async () => {
				const createdRes = await createResource({
					file: null,
					type: resourceType,
					resource: {
						name: activity.name + ' video',
						subject: course?.subject,
						url: videoUrl,
					},
				});
				activity.resource = createdRes;
				await api.db.courses.addResourceInActivity(
					course,
					activity,
					activity.resource,
				);
				setVideoUrl(undefined);
				forceUpdateCourse();
			};
			createResourceWithURL();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [videoUrl]);

	if (!courseElement) {
		return <></>;
	}

	/**
	 * Renders the activity depending on its type
	 * @returns The specific activity depending on its type
	 * @author Enric Soldevila
	 */
	const renderSpecificActivity = () => {
		switch (activity.type) {
			case ACTIVITY_TYPE.CHALLENGE:
				return (
					<ActivityChallenge
						courseElement={courseElement}
						editMode={editMode}
					/>
				);
			case ACTIVITY_TYPE.THEORY:
				return (
					<ActivityTheory courseElement={courseElement} editMode={editMode} />
				);
			case ACTIVITY_TYPE.VIDEO:
				return <ActivityVideo activity={activity as ActivityVideoModel} />;
			case ACTIVITY_TYPE.PDF:
				return <ActivityPdf activity={activity as ActivityPdfModel} />;
			case ACTIVITY_TYPE.ASSIGNMENT:
				return (
					<ActivityAssignment activity={activity as ActivityAssignmentModel} />
				);
			default:
				return (
					<div className="w-full h-full flex justify-center items-center">
						Not implemented '{activity.type}'
					</div>
				);
		}
	};

	const createSpecificResource = async (fromVideoUrl?: boolean) => {
		if (!course) return;
		const resourceType = activity.allowedResources[0];
		switch (resourceType) {
			case RESOURCE_TYPE.FILE:
			case RESOURCE_TYPE.PDF:
			case RESOURCE_TYPE.IMAGE:
				inputFileRef.current?.click();
				break;
			case RESOURCE_TYPE.VIDEO:
				if (fromVideoUrl) {
					setVideoUrl(null);
				} else inputFileRef.current?.click();
				break;
			case RESOURCE_TYPE.THEORY:
				const createdRes = await createResource({
					file: null,
					type: resourceType,
					resource: { name: 'New theory', subject: course?.subject },
				});
				activity.resource = createdRes;
				await api.db.courses.addResourceInActivity(
					course,
					activity,
					activity.resource,
				);
				forceUpdateCourse();
				break;
		}
	};

	return (
		courseElement && (
			<div
				className={classNames(
					'w-full h-full relative overflow-y-auto flex flex-col px-8',
					tab.tab === 'view' ? 'py-8' : 'py-0',
				)}
			>
				<div className="text-4xl bg-[color:var(--background-color)] mb-6 w-full border-[color:var(--bg-shade-four-color)]">
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
				{activity.header !== null ? (
					<div className="flex justify-center items-center pb-5">
						<div className="flex flex-row gap-2 text-sm w-full">
							<div className="w-full">
								<RichTextEditor
									readOnly={!editMode}
									onChange={update('header')}
									defaultText={activity.header}
								/>
							</div>
							{editMode && (
								<FontAwesomeIcon
									icon={faMinusCircle}
									onClick={async () => {
										// eslint-disable-next-line no-restricted-globals
										if (confirm(t('course.activity.remove_header_confirm')))
											await updateActivity(activity, { header: null });
									}}
									size="2x"
									className="p-1 mb-2 border cursor-pointer text-red-600
									border-red-600 opacity-75 transition-colors hover:opacity-100 hover:bg-red-600 hover:text-white"
								/>
							)}
						</div>
					</div>
				) : (
					editMode && (
						<ButtonAdd className="mb-5" what="header" activity={activity} />
					)
				)}
				<div className="">
					{activity.resource ? (
						<div className="flex flex-col items-end gap-2">
							{loading ? <LoadingScreen relative /> : renderSpecificActivity()}
							{editMode && (
								<div
									onClick={() => removeResourceFromActivity(activity)}
									className="border text-sm p-1 cursor-pointer text-red-600 border-red-600 opacity-75 transition-colors hover:opacity-100 hover:bg-red-600 hover:text-white"
								>
									{t('course.activity.remove_resource')}
								</div>
							)}
						</div>
					) : (
						<div className="flex flex-col items-center gap-4">
							{editMode ? (
								<>
									<Button
										variant="primary"
										onClick={() => {
											setVideoUrl(undefined);
											setOpenModalImportResource(true);
										}}
									>
										{t(`course.activity.import_resource.${activity.type}`)}
									</Button>
									{activity.type !== ACTIVITY_TYPE.CHALLENGE &&
										activity.type !== ACTIVITY_TYPE.VIDEO && (
											<Button
												variant="secondary"
												onClick={() => createSpecificResource()}
											>
												{t(`course.activity.create_resource.${activity.type}`)}
											</Button>
										)}
									{activity.type === ACTIVITY_TYPE.VIDEO &&
										(videoUrl === undefined ? (
											<>
												<Button
													variant="secondary"
													onClick={() => createSpecificResource()}
												>
													{t(
														`course.activity.create_resource.${activity.type}.upload`,
													)}
												</Button>
												<Button
													variant="secondary"
													onClick={() => createSpecificResource(true)}
												>
													{t(
														`course.activity.create_resource.${activity.type}.url`,
													)}
												</Button>
											</>
										) : (
											<InputGroup
												label="Video URL"
												onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
													setVideoUrl(e.target.value);
												}}
												onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
													e.key.toLowerCase() === 'enter' &&
													setVideoUrl(e.currentTarget.value)
												}
												errors={isInvalidURL ? { type: 'pattern' } : undefined}
												messages={{
													pattern: t('resources.video.form.invalid_url'),
												}}
											></InputGroup>
										))}
								</>
							) : (
								<div>{t('course.activity.empty')}</div>
							)}
						</div>
					)}
				</div>
				{activity.footer !== null ? (
					<div className="flex justify-center items-center pt-5">
						<div className="flex flex-row gap-2 text-sm w-full">
							<div className="w-full">
								<RichTextEditor
									readOnly={!editMode}
									onChange={update('footer')}
									defaultText={activity.footer}
								/>
							</div>
							{editMode && (
								<FontAwesomeIcon
									icon={faMinusCircle}
									onClick={async () => {
										// eslint-disable-next-line no-restricted-globals
										if (confirm(t('course.activity.remove_footer_confirm')))
											await updateActivity(activity, { footer: null });
									}}
									size="2x"
									className="p-1 mb-2 border cursor-pointer text-red-600
									border-red-600 opacity-75 transition-colors hover:opacity-100 hover:bg-red-600 hover:text-white"
								/>
							)}
						</div>
					</div>
				) : (
					editMode && (
						<ButtonAdd className="mt-5" what="footer" activity={activity} />
					)
				)}
				<div className="flex flex-row items-center justify-evenly py-12">
					<button
						className="flex items-center gap-4 cursor-pointer disabled:cursor-auto disabled:opacity-25"
						disabled={previousActivity == null}
						onClick={() =>
							setTab({
								openedActivity: previousActivity,
							})
						}
					>
						<FontAwesomeIcon size="1x" icon={faChevronLeft} />
						{t('course.activity.previous')}
					</button>
					<button
						className="flex items-center gap-4 cursor-pointer disabled:cursor-auto disabled:opacity-25"
						disabled={nextActivity == null}
						onClick={() => {
							setTab({
								openedActivity: nextActivity,
							});
						}}
					>
						{t('course.activity.next')}
						<FontAwesomeIcon size="1x" icon={faChevronRight} />
					</button>
				</div>
				<input
					id="file-upload"
					name="file-upload"
					type="file"
					className="hidden"
					ref={inputFileRef}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						e.target.files && setSelectedFile(e.target.files[0])
					}
				/>
			</div>
		)
	);
};

export default Activity;
