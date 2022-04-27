import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BundleCardProps } from './bundleCardTypes';
import { faFileArchive } from '@fortawesome/free-solid-svg-icons';
import { classNames } from '../../../Types/utils';

const BundleCard = ({ bundle, onSelect }: BundleCardProps) => {
	return (
		<div className="h-auto">
			<div
				className={classNames(
					'relative flex flex-col justify-center items-center aspect-[4/3] rounded-2xl border border-[color:var(--bg-shade-four-color)] bg-[color:var(--background-color)]',
					onSelect &&
						'cursor-pointer hover:bg-[color:var(--bg-shade-one-color)]',
				)}
				onClick={() => onSelect && onSelect(bundle)}
			>
				<div>
					<FontAwesomeIcon
						className="text-[color:var(--fg-shade-four-color)]"
						size="2x"
						icon={faFileArchive}
					/>
				</div>
			</div>
			<div className="text-center mt-4 overflow-hidden text-ellipsis whitespace-nowrap">
				{bundle.name}
			</div>
		</div>
	);
};

export default BundleCard;
