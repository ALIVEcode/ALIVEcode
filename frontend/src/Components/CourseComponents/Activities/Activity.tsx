import { useCallback, useContext } from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';
import {
	Activity as ActivityModel,
	ACTIVITY_TYPE,
} from '../../../Models/Course/activity.entity';
import ActivityChallenge from './ActivityChallenge';
import RichTextEditor from '../../RichTextComponents/RichTextEditor/RichTextEditor';
import ButtonAdd from './ButtonAdd';
import { Descendant } from 'slate';
import { ActivityChallenge as ActivityChallengeModel } from '../../../Models/Course/activities/activity_challenge.entity';
import Button from '../../UtilsComponents/Buttons/Button';
import { useTranslation } from 'react-i18next';
import { ActivityVideo as ActivityVideoModel } from '../../../Models/Course/activities/activity_video.entity';
import ActivityVideo from './ActivityVideo';
import Link from '../../UtilsComponents/Link/Link';
import { faExpandAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Shows the opened activity. Renders different component depending on the type of the activity opened.
 *
 * @returns The activity currently opened. Shows the generic component and then the specific one depending
 *          on the type of the activity.
 *
 * @author Enric Soldevila, Mathis Laroche
 */
const Activity = ({ activity }: { activity: ActivityModel }) => {
	const { course, updateActivity, setOpenModalImportResource } =
		useContext(CourseContext);
	const { t } = useTranslation();

	const update = useCallback(
		(what: 'header' | 'footer') => {
			return async (value: Descendant[]) => {
				if (!activity) return;
				await updateActivity(activity, { [what]: value });
			};
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[activity, course],
	);

	if (!activity) {
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
				return (
					<ActivityChallenge activity={activity as ActivityChallengeModel} />
				);
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
		activity && (
			<div className="w-full h-full relative overflow-y-auto flex flex-col px-8">
				<FontAwesomeIcon icon={activity.icon} className="pb-2 m-0" size="3x" color="lightgrey" />
				<div className="z-10 sticky top-0 pt-2 text-4xl bg-[color:var(--background-color)] pb-6 w-full border-[color:var(--bg-shade-four-color)]">
					<b>{activity.name}</b>
				</div>
				<div className="flex">
					{activity.header !== null ? (
						<div className="text-sm pt-3 pb-3 w-full">
							<RichTextEditor
								onChange={update('header')}
								defaultText={activity.header}
							/>
						</div>
					) : (
						<ButtonAdd what="header" activity={activity} />
					)}
				</div>
				<div className="py-5">
					{activity.resource ? (
						<div className="flex flex-col items-center gap-4">
							{renderSpecificActivity()}
							<Button
								variant="danger"
								onClick={() => console.log('Not Implemented')}
							>
								{t('course.activity.remove_resource')}
							</Button>
						</div>
					) : (
						<div className="flex flex-col items-center gap-4">
							<Button variant="primary">
								{t('course.activity.create_resource')}
							</Button>
							<Link
								onClick={() => setOpenModalImportResource(true)}
								className="[color:var(--fg-shade-four-color)] hover:[color:var(--fg-shade-one-color)] hover:underline hover:cursor-pointer"
							>
								{t('course.activity.import_resource')}
							</Link>
						</div>
					)}
				</div>
				<div className=" flex justify-center items-center">
					{activity.footer !== null ? (
						<div className="text-sm py-3 w-full">
							<RichTextEditor
								onChange={update('footer')}
								defaultText={activity.footer}
							/>
						</div>
					) : (
						<ButtonAdd what="footer" activity={activity} />
					)}
				</div>
			</div>
		)
	);
};

export default Activity;
