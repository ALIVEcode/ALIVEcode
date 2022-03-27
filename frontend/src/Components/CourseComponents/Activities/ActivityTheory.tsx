import { ActivityTheory as ActivityTheoryModel } from '../../../Models/Course/activities/activity_theory.entity';
import RichTextEditor from '../../RichTextComponents/RichTextEditor/RichTextEditor';
import { useContext } from 'react';
import RichTextDocument from '../../RichTextComponents/RichTextDocument/RichTextDocument';
import { ActivityProps } from './activityTypes';

/**
 * Shows an activity of type Theory
 * @returns The activity of type Theory
 *
 * @author Enric Soldevila
 */
const ActivityTheory = ({ activity, editMode }: ActivityProps<ActivityTheoryModel>) => {
	return (
		<div className="w-full">
			<div>
				<RichTextDocument
					onChange={value => {}}
					defaultText={activity.resource?.document}
					// readOnly={!editMode}
				/>
			</div>
		</div>
	);
};

export default ActivityTheory;
