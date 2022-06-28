import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDate } from '../../../Types/formatting';
import { useTranslation } from 'react-i18next';
import { classNames } from '../../../Types/utils';
import { IoTObjectCardProps } from './iotObjectCardTypes';

const IoTProjectCard = ({ object }: IoTObjectCardProps) => {
	const { t } = useTranslation();

	return (
		<div
			className={classNames(
				'px-4 py-2 flex tablet:flex-row tablet:text-left items-center justify-between bg-[color:var(--background-color)] border border-[color:var(--bg-shade-four-color)]',
				// Phone view
				'flex-col text-center',
				// Hover
				'hover:bg-[color:var(--bg-shade-one-color)] hover:cursor-pointer',
			)}
		>
			<div>
				<div>{object.name}</div>
				<div className="text-sm text-[color:var(--fg-shade-four-color)]">
					{t('msg.time.last_updated')}: {formatDate(object.updateDate, t)}
				</div>
			</div>
			<div>
				<FontAwesomeIcon
					icon={faPencilAlt}
					className="mr-2 text-[color:var(--bg-shade-four-color)] hover:text-[color:var(--foreground-color)] transition-all"
				/>
				<FontAwesomeIcon
					icon={faTrash}
					className="text-[color:var(--bg-shade-four-color)] hover:text-[color:var(--danger-color)] transition-all"
				/>
			</div>
		</div>
	);
};

export default IoTProjectCard;
