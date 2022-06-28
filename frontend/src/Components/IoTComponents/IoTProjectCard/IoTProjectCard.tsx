import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IoTProjectCardProps } from './iotProjectCardTypes';
import { formatDate } from '../../../Types/formatting';
import { useTranslation } from 'react-i18next';
import { classNames } from '../../../Types/utils';
import useRoutes from '../../../state/hooks/useRoutes';
import { useNavigate } from 'react-router';

const IoTProjectCard = ({ project }: IoTProjectCardProps) => {
	const { t } = useTranslation();
	const { routes } = useRoutes();
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
