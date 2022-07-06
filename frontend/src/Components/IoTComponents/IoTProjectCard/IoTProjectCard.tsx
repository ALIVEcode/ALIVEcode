import { faTrash, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IoTProjectCardProps } from './iotProjectCardTypes';
import { formatDate } from '../../../Types/formatting';
import { useTranslation } from 'react-i18next';
import { classNames } from '../../../Types/utils';
import useRoutes from '../../../state/hooks/useRoutes';
import { useNavigate } from 'react-router';
import { useAlert } from 'react-alert';

const IoTProjectCard = ({
	project,
	handleProjectDeletion,
}: IoTProjectCardProps) => {
	const { t } = useTranslation();
	const { routes } = useRoutes();
	const alert = useAlert();
	const navigate = useNavigate();

	return (
		<div
			className={classNames(
				'px-4 py-2 flex tablet:flex-row tablet:text-left items-center justify-between bg-[color:var(--background-color)] border-b border-[color:var(--bg-shade-four-color)]',
				// Phone view
				'flex-col text-center',
				// Hover
				'hover:bg-[color:var(--bg-shade-one-color)] cursor-pointer',
			)}
			onClick={() =>
				navigate(routes.auth.iot_project.path.replace(':id', project.id))
			}
		>
			<div>
				<div>{project.name}</div>
				<div className="text-sm text-[color:var(--fg-shade-four-color)]">
					{t('msg.time.last_updated')}: {formatDate(project.updateDate, t)}
				</div>
			</div>
			<div>
				<FontAwesomeIcon
					icon={faClipboard}
					className="mr-2 text-[color:var(--bg-shade-four-color)] hover:text-[color:var(--logo-color)] transition-all"
					onClick={e => {
						e.stopPropagation();
						navigator.clipboard.writeText(project.id);
						alert.success(t('msg.id_copied'));
					}}
				/>
				<FontAwesomeIcon
					icon={faTrash}
					className="text-[color:var(--bg-shade-four-color)] hover:text-[color:var(--danger-color)] transition-all"
					onClick={e => {
						e.stopPropagation();
						handleProjectDeletion(project);
					}}
				/>
			</div>
		</div>
	);
};

export default IoTProjectCard;
