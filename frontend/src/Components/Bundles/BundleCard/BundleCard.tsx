import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BundleCardProps } from './bundleCardTypes';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { classNames } from '../../../Types/utils';
import { useTranslation } from 'react-i18next';

/**
 * Bundle card used to render a visual representation of a bundle and its content
 * @param bundle Bundle to render
 * @param onSelect Callback when the bundle is clicked
 * @returns The bundle card
 *
 * @author Enric Soldevila
 */
const BundleCard = ({ bundle, onSelect }: BundleCardProps) => {
	const { t } = useTranslation();

	return (
		<div
			className={classNames(
				'w-64 h-56 flex flex-col whitespace-nowrap gap-2 p-4 rounded-2xl border border-[color:var(--bg-shade-four-color)] bg-[color:var(--background-color)]',
				onSelect && 'cursor-pointer hover:bg-[color:var(--bg-shade-one-color)]',
			)}
			onClick={() => onSelect && onSelect(bundle)}
		>
			<div className="flex justify-center">
				<FontAwesomeIcon
					className="h-full text-[color:var(--fg-shade-four-color)]"
					size="3x"
					icon={faBriefcase}
				/>
			</div>
			<div className="text-center text-sm text-ellipsis whitespace-nowrap">
				<div className="font-semibold text-lg mb-1">{bundle.name}</div>
				<div>
					<label className="font-semibold">
						{bundle.courseTemplates?.length}
					</label>{' '}
					{t('msg.courseTemplate') +
						(bundle.courseTemplates && bundle.courseTemplates?.length > 1
							? 's'
							: '')}
				</div>
				<div>
					<label className="font-semibold">{bundle.resources?.length}</label>{' '}
					{t('msg.resource') +
						(bundle.resources && bundle.resources?.length > 1 ? 's' : '')}
				</div>
			</div>
			<div className="flex justify-center whitespace-normal items-center overflow-y-auto h-full text-center text-[color:var(--fg-shade-four-color)] text-xs">
				<div>{bundle.description}</div>
			</div>
		</div>
	);
};

export default BundleCard;
