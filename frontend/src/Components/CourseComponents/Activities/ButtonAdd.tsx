import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';
import { useTranslation } from 'react-i18next';
import { Activity } from '../../../Models/Course/activity.entity';

const ButtonAdd = ({
	activity,
	what,
}: {
	activity: Activity;
	what: 'header' | 'footer';
}) => {
	const { updateActivity } = useContext(CourseContext);

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
			<FontAwesomeIcon icon={faPlus} className="[color:var(--logo-color)]" />
		</div>
	);
};

export default ButtonAdd;
