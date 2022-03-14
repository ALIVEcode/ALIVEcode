import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Descendant } from 'slate';
import api from '../../../Models/api';
import { useContext } from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';
import { useTranslation } from 'react-i18next';

const ButtonAdd = ({ what }: { what: 'header' | 'footer' }) => {
	const { openedActivity: activity, updateActivity } =
		useContext(CourseContext);

	const { t } = useTranslation();

	return (
		<div
			className="border p-2 border-[color:var(--bg-shade-four-color)] text-[color:var(--foreground-color)] mt-2 border-opacity-25 w-24 hover:cursor-pointer"
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
			title={t(`course.activity.${what}.new`)}
			onClick={async () => {
				if (!activity) return;
				const value = [
					{
						type: 'paragraph',
						children: [
							{
								text: 'Hello, World!',
							},
						],
					},
				];
				await updateActivity(activity, { [what]: value });
			}}
		>
			<FontAwesomeIcon
				icon={faPlus}
				className="[color:var(--contrast-color)]"
			/>
		</div>
	);
};

export default ButtonAdd;
