import { IoTProjectLayout } from '../IoTproject.entity';
import { IoTComponentManager } from './IoTComponentManager';
import { IoTComponent } from './IoTComponent';

export type IoTSocketUpdateRequest = {
	id: string;
	value: any;
};

export class IoTSocket {
	private socket: WebSocket;
	private id: string;
	private layout: IoTProjectLayout;
	private name: string;
	private iotComponentManager: IoTComponentManager;
	private onRender: (layout: IoTProjectLayout) => void;

	constructor(
		id: string,
		layout: IoTProjectLayout,
		name: string,
		onRender: (layout: IoTProjectLayout) => void,
	) {
		this.id = id;
		this.layout = layout;
		this.name = name;
		this.onRender = onRender;

		this.iotComponentManager = new IoTComponentManager(
			this.layout,
			this.onComponentUpdate,
			(components: Array<IoTComponent>) => {
				this.layout.components = components;
				this.onRender(this.layout);
			},
			this,
		);
		this.openSocket();
	}

	private onComponentUpdate(layout: Array<IoTComponent>) {}

	public setOnRender(onRender: (layout: IoTProjectLayout) => void) {
		this.onRender = onRender;
	}

	public openSocket() {
		if (!process.env.REACT_APP_IOT_URL)
			throw new Error('Env variable REACT_APP_IOT_URL not set');

		if (this.socket && (this.socket.CONNECTING || this.socket.OPEN)) return;

		this.socket = new WebSocket(process.env.REACT_APP_IOT_URL);

		this.socket.onopen = () => {
			if (process.env.REACT_APP_DEBUG)
				console.log('Connected to IoTProjectSocket');

			this.socket.onmessage = e => {
				const data = JSON.parse(e.data);
				switch (data.event) {
					case 'update':
						this.onReceiveUpdate(data.data);
						break;
				}
			};

			this.socket.send(
				JSON.stringify({
					event: 'connect_watcher',
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
		if (this.socket) this.socket.close();
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
					event: 'send_object',
					data: {
						targetId,
						actionId: Number(actionId),
						value,
					},
				}),
			);
		}
	}

	public onReceiveUpdate(request: IoTSocketUpdateRequest) {
		this.getComponentManager()?.updateComponent(request.id, request.value);
	}

	public getComponentManager(): IoTComponentManager | null {
		return this.iotComponentManager;
	}
}