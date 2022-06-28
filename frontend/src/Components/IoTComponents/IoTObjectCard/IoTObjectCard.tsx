import {
	faPencilAlt,
	faServer,
	faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDate } from '../../../Types/formatting';
import { useTranslation } from 'react-i18next';
import { classNames } from '../../../Types/utils';
import { IoTObjectCardProps } from './iotObjectCardTypes';
import { FocusEvent, KeyboardEvent, useState } from 'react';
import FormInput from '../../UtilsComponents/FormInput/FormInput';
import { faClipboard, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAlert } from 'react-alert';

const IoTProjectCard = ({
	object,
	handleObjectUpdate,
	handleObjectDeletion,
	handleLogsOpening,
}: IoTObjectCardProps) => {
	const { t } = useTranslation();
	const [editMode, setEditMode] = useState(false);
	const alert = useAlert();

	const submitUpdate = async (name: string) => {
		handleObjectUpdate(object, name);
		setEditMode(false);
	};

	return (
		<div
			className={classNames(
				'px-4 py-2 flex tablet:flex-row tablet:text-left items-center justify-between bg-[color:var(--background-color)] border-b border-[color:var(--bg-shade-four-color)]',
				// Phone view
				'flex-col text-center',
			)}
		>
			<div>
				{editMode ? (
					<FormInput
						type="text"
						defaultValue={object.name}
						onBlur={(e: FocusEvent<HTMLInputElement>) =>
							submitUpdate(e.target.value)
						}
						onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
							e.keyCode === 13 && submitUpdate(e.currentTarget.value)
						}
					/>
				) : (
					<div>{object.name}</div>
				)}
				<div className="text-sm text-[color:var(--fg-shade-four-color)]">
					{t('msg.time.last_updated')}: {formatDate(object.updateDate, t)}
				</div>
			</div>
			<div>
				<FontAwesomeIcon
					icon={faClipboard}
					className="mr-2 text-[color:var(--bg-shade-four-color)] hover:text-[color:var(--logo-color)] transition-all cursor-pointer"
					onClick={e => {
						e.stopPropagation();
						navigator.clipboard.writeText(object.id);
						alert.success(t('msg.id_copied'));
					}}
				/>
				<FontAwesomeIcon
					icon={faServer}
					className="mr-2 text-[color:var(--bg-shade-four-color)] hover:text-green-500 transition-all cursor-pointer"
					onClick={e => {
						e.stopPropagation();
						handleLogsOpening(object);
					}}
				/>
				<FontAwesomeIcon
					icon={editMode ? faTimes : faPencilAlt}
					className="mr-2 text-[color:var(--bg-shade-four-color)] hover:text-[color:var(--foreground-color)] transition-all cursor-pointer"
					onClick={e => {
						e.stopPropagation();
						setEditMode(!editMode);
					}}
				/>
				<FontAwesomeIcon
					icon={faTrash}
					className="text-[color:var(--bg-shade-four-color)] hover:text-[color:var(--danger-color)] transition-all cursor-pointer"
					onClick={() => handleObjectDeletion(object)}
				/>
			</div>
		</div>
	);
};

export default IoTProjectCard;
