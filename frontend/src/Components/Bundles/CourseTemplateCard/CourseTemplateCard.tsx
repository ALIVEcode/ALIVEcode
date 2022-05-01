import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CourseTemplateCardProps } from './courseTemplateCardTypes';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { classNames } from '../../../Types/utils';
import { useTranslation } from 'react-i18next';

/**
 * CourseTemplate card used to render a visual representation of a CourseTemplate and its content
 * @param template CourseTemplate to render
 * @param onSelect Callback when the CourseTemplate is clicked
 * @returns The CourseTemplate card
 *
 * @author Enric Soldevila
 */
const CourseTemplateCard = ({
	template,
	onSelect,
}: CourseTemplateCardProps) => {
	const { t } = useTranslation();

	return (
		<div
			className={classNames(
				'w-64 h-56 flex flex-col whitespace-nowrap gap-2 p-4 rounded-2xl border border-[color:var(--bg-shade-four-color)] bg-[color:var(--background-color)]',
				onSelect && 'cursor-pointer hover:bg-[color:var(--bg-shade-one-color)]',
			)}
			onClick={() => onSelect && onSelect(template)}
		>
			<div className="flex justify-between">
				<div className="text-center overflow-hidden text-ellipsis whitespace-nowrap">
					{template.name}
				</div>
				<FontAwesomeIcon
					className="h-full text-[color:var(--fg-shade-four-color)]"
					size="1x"
					icon={faCopy}
				/>
			</div>
			<div className="overflow-y-auto h-full text-xs">
				<div className="font-semibold mb-2">
					{t('bundle.courseTemplate.content')}:
				</div>
				{template.description.split('\n').map((t, idx) => (
					<div key={idx} className="whitespace-normal mb-1">
						- {t}
					</div>
				))}
			</div>
		</div>
	);
};

export default CourseTemplateCard;
