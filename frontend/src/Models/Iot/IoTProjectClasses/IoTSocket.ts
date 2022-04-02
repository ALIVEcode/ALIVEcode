import {
	IoTProject,
	IoTProjectDocument,
	parseIoTProjectDocument,
} from '../IoTproject.entity';
import { IoTComponentManager } from './IoTComponentManager';
import { IoTComponent } from './IoTComponent';
import { IoTProjectLayout, parseIoTProjectLayout } from '../IoTproject.entity';
import { IOT_EVENT } from './IoTTypes';

export type IoTSocketUpdateRequest = {
	id: string;
	value: any;
};

export type IoTSocketUpdateDocumentRequest = {
	doc: IoTProjectDocument;
};

export type IoTSocketUpdateLayoutRequest = {
	layout: IoTProjectLayout;
};

export class IoTSocket {
	private socket: WebSocket;
	private id: string;
	private project: IoTProject;
	private name: string;
	private iotComponentManager: IoTComponentManager;
	private onRender: (saveLayout: boolean) => void;

	constructor(
		id: string,
		project: IoTProject,
		name: string,
		onRender: (saveLayout: boolean) => void,
	) {
		this.id = id;
		this.project = project;
		this.name = name;
		this.onRender = onRender;

		this.iotComponentManager = new IoTComponentManager(
			this.project,
			(saveLayout: boolean, components: Array<IoTComponent>) => {
				this.project.layout.components = components;
				this.onRender(saveLayout);
			},
			this,
		);
		this.openSocket();
	}

	public setOnRender(onRender: (saveLayout: boolean) => void) {
		this.onRender = onRender;
	}

	public openSocket() {
		if (!process.env.IOT_URL) throw new Error('Env variable IOT_URL not set');

		if (this.socket && (this.socket.CONNECTING || this.socket.OPEN)) return;

		this.socket = new WebSocket(process.env.IOT_URL);

		this.socket.onopen = () => {
			if (process.env.DEBUG) console.log('Connected to IoTProjectSocket');

			this.socket.onmessage = e => {
				const data = JSON.parse(e.data);
				switch (data.event) {
					case IOT_EVENT.RECEIVE_UPDATE_COMPONENT:
						this.onReceiveUpdate(data.data);
						break;
					case IOT_EVENT.RECEIVE_DOC:
						this.onDocumentUpdate(data.data);
						break;
					case IOT_EVENT.RECEIVE_INTERFACE:
						this.onLayoutUpdate(data.data);
						break;
				}
			};

			this.socket.send(
				JSON.stringify({
					event: IOT_EVENT.CONNECT_WATCHER,
					data: {
						iotProjectId: this.id,
						iotProjectName: this.name,
					},
				}),
			);
		};

		this.socket.onerror = (ev: Event) => {
			console.error(ev);
		};
	}

	public closeSocket() {
		if (this.socket && this.socket.OPEN) this.socket.close();
	}

	public sendData(targetId: string, actionId: number, data: string) {
		if (this.socket.OPEN) {
			let value = {};

			// Try to get JSON, if invalid set empty object
			try {
				value = JSON.parse(data);
			} catch {}

			this.socket.send(
				JSON.stringify({
					event: IOT_EVENT.SEND_ACTION,
					data: {
						targetId,
						actionId: Number(actionId),
						value,
					},
				}),
			);
		}
	}

	public onDocumentUpdate(request: IoTSocketUpdateDocumentRequest) {
		this.project.document = parseIoTProjectDocument(request.doc);
		this.getComponentManager()
			?.getComponents()
			.map(c => c.updateRef());
		this.onRender(false);
	}

	public onLayoutUpdate(request: IoTSocketUpdateLayoutRequest) {
		this.project.layout = parseIoTProjectLayout(request.layout);
		this.getComponentManager()?.setNewLayout(this.project.layout);
		this.onRender(false);
	}

	public onReceiveUpdate(request: IoTSocketUpdateRequest) {
		this.getComponentManager()?.updateComponent(request.id, request.value);
	}

	public getComponentManager(): IoTComponentManager | null {
		return this.iotComponentManager;
	}
}
