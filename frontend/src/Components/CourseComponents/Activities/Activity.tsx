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

/**
 * Shows the opened activity. Renders different component depending on the type of the activity opened.
 *
 * @returns The activity currently opened. Shows the generic component and then the specific one depending
 *          on the type of the activity.
 *
 * @author Enric Soldevila, Mathis Laroche
 */
const Activity = ({ activity }: { activity: ActivityModel }) => {
	const { course, updateActivity } = useContext(CourseContext);

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
			<div className="w-full h-full relative overflow-y-auto flex flex-col">
				<div className="z-10 sticky top-0 text-2xl text-center bg-[color:var(--background-color)] py-6 w-full border-b border-[color:var(--bg-shade-four-color)]">
					{activity.name}
				</div>
				<div className=" flex justify-center items-center">
					{activity.header !== null ? (
						<div className="text-sm border-b border-dotted py-3 border-[color:var(--bg-shade-four-color)] w-full">
							<RichTextEditor
								onChange={update('header')}
								defaultText={activity.header}
							/>
						</div>
					) : (
						<ButtonAdd what="header" activity={activity} />
					)}
				</div>
				<div className="py-5">{renderSpecificActivity()}</div>
				<div className=" flex justify-center items-center">
					{activity.footer !== null ? (
						<div className="text-sm border-t border-dotted py-3 border-[color:var(--bg-shade-four-color)] w-full">
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
