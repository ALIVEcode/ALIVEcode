import {
	IoTLogs,
	IoTLogModel,
} from '../../../../Models/Iot/IoTProjectClasses/Components/IoTLogs';
import { formatDate } from '../../../../Types/formatting';
import { useTranslation } from 'react-i18next';
import { StyledIoTLogsComponent } from './iotLogsComponentTypes';
import Button from '../../../UtilsComponents/Buttons/Button';

const IoTLogsComponent = ({ component }: { component: IoTLogs }) => {
	const { t } = useTranslation();

	return (
		<StyledIoTLogsComponent>
			<div className="log-row">
				<div className="log-content">
					<div className="log-entries">
						{component.displayedValue &&
						component.displayedValue.length <= 0 ? (
							<label>{t('iot.project.interface.components.logs.empty')}</label>
						) : component.displayedValue ? (
							component.displayedValue.map((l: IoTLogModel, idx: number) => (
								<label key={idx}>
									<span style={{ color: 'gray' }}>{formatDate(l.date, t)}</span>{' '}
									: {l.text}
								</label>
							))
						) : (
							<i className="font-bold text-red-600">
								{t('iot.project.interface.errors.ref')}
							</i>
						)}
					</div>
				</div>
			</div>
			<div>
				{!component.isRef() && (
					<Button onClick={() => component.clearLogs()} variant="danger">
						{t('iot.project.interface.components.logs.clear')}
					</Button>
				)}
			</div>
		</StyledIoTLogsComponent>
	);
};

export default IoTLogsComponent;
