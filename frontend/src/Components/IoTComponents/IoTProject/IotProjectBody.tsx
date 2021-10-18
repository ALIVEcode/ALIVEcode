import { IoTProject, IoTProjectLayout } from '../../../Models/Iot/IoTproject.entity';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { IoTSocket } from '../../../Models/Iot/IoTProjectClasses/IoTSocket';
import { classToPlain } from 'class-transformer';
import { IoTComponent } from '../../../Models/Iot/IoTProjectClasses/IoTComponent';
import { IOT_COMPONENT_TYPE } from '../../../Models/Iot/IoTProjectClasses/IoTComponent';
import IoTButtonComponent from '../IoTProjectComponents/IoTButtonComponent';
import { Col, Row, Container } from 'react-bootstrap';
import IoTProgressBarComponent from '../IoTProjectComponents/IoTProgressBarComponent';
import { IoTProgressBar } from '../../../Models/Iot/IoTProjectClasses/Components/IoTProgressBar';
import IoTLogsComponent from '../IoTProjectComponents/IoTLogsComponent/IoTLogsComponent';
import { IoTLogs } from '../../../Models/Iot/IoTProjectClasses/Components/IoTLogs';
import api from '../../../Models/api';
import { StyledIoTProjectBody } from './iotProjectBodyTypes';

const IoTProjectBody = ({ project }: { project: IoTProject }) => {
	const [components, setComponents] = useState<Array<IoTComponent>>([]);
	const [lastSaved, setLastSaved] = useState<number>(Date.now() - 4000);

	const saveComponents = useCallback(
		async (components: Array<IoTComponent>) => {
			if (Date.now() - lastSaved < 5000) return;

			setLastSaved(Date.now());
			project.layout.components = components;
			const plainProject = classToPlain(project);
			await api.db.iot.projects.updateLayout(project.id, plainProject.layout);
		},
		[lastSaved, project],
	);

	const onLayoutChange = useCallback(
		(layout: IoTProjectLayout) => {
			setComponents([...layout.components]);
			saveComponents(layout.components);
		},
		[saveComponents],
	);
	console.log(project);

	const socket = useMemo(
		() =>
			new IoTSocket(
				project,
				/*plainToClass(IoTProject, {
					...project,
					layout: {
						components: [
							{
								id: 'button',
								type: IOT_COMPONENT_TYPE.BUTTON,
							},
							{
								id: 'button2',
								type: IOT_COMPONENT_TYPE.BUTTON,
							},
							{
								id: 'progress',
								type: IOT_COMPONENT_TYPE.PROGRESS_BAR,
								min: 100,
								max: 1000,
							},
							{
								id: 'logs',
								type: IOT_COMPONENT_TYPE.LOGS,
								value: [],
							},
						],
					},
				}),*/
				onLayoutChange,
			),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[project],
	);

	useEffect(() => {
		socket.setOnRender(onLayoutChange);
	}, [socket, onLayoutChange]);

	const renderComponent = (component: IoTComponent) => {
		switch (component.type) {
			case IOT_COMPONENT_TYPE.BUTTON:
				return <IoTButtonComponent component={component} />;
			case IOT_COMPONENT_TYPE.PROGRESS_BAR:
				return (
					<IoTProgressBarComponent component={component as IoTProgressBar} />
				);
			case IOT_COMPONENT_TYPE.LOGS:
				return <IoTLogsComponent component={component as IoTLogs} />;
		}
	};

	const getComponentsMatrix = (): Array<Array<IoTComponent>> => {
		const componentsMatrix = [];
		for (let i = 0; i < Math.ceil(components.length / 3); i++) {
			const row = components.slice(i * 3, i * 3 + 3);
			console.log(components);
			componentsMatrix.push(row);
		}
		console.log(componentsMatrix);
		return componentsMatrix;
	};

	return (
		<StyledIoTProjectBody>
			<Container fluid>
				{getComponentsMatrix().map((row, idx) => (
					<Row className="w-100" key={idx}>
						{row.map((c, idx2) => (
							<Col key={idx2}>{renderComponent(c)}</Col>
						))}
					</Row>
				))}
			</Container>
		</StyledIoTProjectBody>
	);
};

export default IoTProjectBody;