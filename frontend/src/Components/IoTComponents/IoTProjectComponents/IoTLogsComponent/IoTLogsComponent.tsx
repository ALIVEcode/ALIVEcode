import { IoTLogs, IoTLogModel } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTLogs';
import { formatDate } from '../../../../Types/formatting';
import { useTranslation } from 'react-i18next';
import { StyledIoTLogsComponent } from './iotLogsComponentTypes';
import Button from '../../../UtilsComponents/Button/Button';
import { Row } from 'react-bootstrap';

const IoTLogsComponent = ({ component }: { component: IoTLogs }) => {
	const { t } = useTranslation();

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
			<Row className="log-row">
				<div className="log-content">
					<div className="log-entries">
						{component.value.length <= 0 ? (
							<label>No logs available</label>
						) : (
							component.value.map((l: IoTLogModel, idx) => (
								<label key={idx}>
									<span style={{ color: 'gray' }}>{formatDate(l.date, t)}</span>{' '}
									: {l.text}
								</label>
							))
						)}
					</div>
				</div>
			</Row>
			<Row>
				<Button onClick={() => component.clearLogs()} variant="danger">
					Clear logs
				</Button>
			</Row>
		</StyledIoTLogsComponent>
	);
};

export default IoTLogsComponent;