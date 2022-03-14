import { useCallback, useContext } from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';
import { useNavigate } from 'react-router';
import { ACTIVITY_TYPE } from '../../../Models/Course/activity.entity';
import ActivityChallenge from './ActivityLevel';
import RichTextEditor from '../../RichTextComponents/RichTextEditor/RichTextEditor';
import api from '../../../Models/api';
import Button from '../../UtilsComponents/Buttons/Button';
import ButtonAdd from './ButtonAdd';
import { Descendant } from 'slate';

/**
 * Shows the opened activity. Renders different component depending on the type of the activity opened.
 *
 * @returns The activity currently opened. Shows the generic component and then the specific one depending
 *          on the type of the activity.
 *
 * @author Enric Soldevila
 */
const Activity = () => {
	const {
		openedActivity: activity,
		course,
		updateActivity,
	} = useContext(CourseContext);
	const navigate = useNavigate();

	const update = useCallback(
		(what: 'header' | 'footer') => {
			return async (value: Descendant[]) => {
				if (!activity) return;
				await updateActivity(activity, { [what]: value });
			};
		},
		[activity, course],
	);

	if (!activity) {
		navigate(-1);
		return <></>;
	}

	/**
	 * Renders the activity depending on its type
	 * @returns The specific activity depending on its type
	 */
	const renderSpecificActivity = () => {
		switch (activity.type) {
			case ACTIVITY_TYPE.CHALLENGE:
				return <ActivityChallenge />;
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
				<div className="z-10 sticky top-0 text-2xl text-center bg-[color:var(--background-color)] py-8 w-full border-b border-[color:var(--bg-shade-four-color)]">
					{activity.name}
				</div>
				{activity.header !== null ? (
					<div className="text-sm border-b py-3 border-[color:var(--bg-shade-four-color)]">
						<RichTextEditor
							onChange={update('header')}
							defaultText={activity.header}
						/>
					</div>
				) : (
					<ButtonAdd what="header" />
				)}

				{renderSpecificActivity()}

				{activity.footer !== null ? (
					<div className="text-sm border-b py-3 border-[color:var(--bg-shade-four-color)]">
						<RichTextEditor
							onChange={update('footer')}
							defaultText={activity.footer}
						/>
					</div>
				) : (
					<ButtonAdd what="footer" />
				)}
			</div>
		)
	);
};

export default Activity;
