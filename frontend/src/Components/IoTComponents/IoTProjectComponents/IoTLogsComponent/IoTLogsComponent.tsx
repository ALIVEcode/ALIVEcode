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

	console.log(component.displayedValue);
	/*useEffect(() => {
		component.clearLogs();
		component.addLog(
			'Jihène Rezgui est rentrée dans le stationnement avec la plaque H2C421',
		);
		component.addLog(
			'Enric Soldevila est rentrée dans le stationnement avec la plaque G9XOCP',
		);
		component.addLog(
			"Quelqu'un de non identifié a essayé de rentrer dans le stationnement avec la plaque P4S19C",
		);
	}, [component]);*/

	return (
		<StyledIoTLogsComponent>
			<div className="log-row">
				<div className="log-content">
					<div className="log-entries">
						{component.displayedValue.length <= 0 ? (
							<label>No logs available</label>
						) : (
							component.displayedValue.map((l: IoTLogModel, idx: number) => (
								<label key={idx}>
									<span style={{ color: 'gray' }}>{formatDate(l.date, t)}</span>{' '}
									: {l.text}
								</label>
							))
						)}
					</div>
				</div>
			</div>
			<div>
				<Button onClick={() => component.clearLogs()} variant="danger">
					Clear logs
				</Button>
			</div>
		</StyledIoTLogsComponent>
	);
};

export default IoTLogsComponent;
