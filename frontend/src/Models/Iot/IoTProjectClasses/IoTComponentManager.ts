import { IoTProjectLayout } from '../IoTproject.entity';
import { IoTTarget } from './IoTTypes';
import { IoTComponent } from './IoTComponent';
import { IoTSocket } from './IoTSocket';

export class IoTComponentManager {
	private components: Array<IoTComponent>;
	private onLayoutUpdate: (layout: Array<IoTComponent>) => void;
	private onRender: (layout: Array<IoTComponent>) => void;
	private socket: IoTSocket;

	constructor(
		layout: IoTProjectLayout,
		onLayoutUpdate: (layout: Array<IoTComponent>) => void,
		onRender: (layout: Array<IoTComponent>) => void,
		socket: IoTSocket,
	) {
		this.components = layout.components;
		this.onLayoutUpdate = onLayoutUpdate;
		this.onRender = onRender;
		this.socket = socket;

		this.components = this.components.map(c => {
			c.setComponentManager(this);
			return c;
		});

		this.render();
	}

	public getSocket() {
		return this.socket;
	}

	public updateComponent(id: string, data: any) {
		const component = this.getComponent(id);
		if (!component) return;
		component.update(data);
		this.render();
	}

	public getComponent(id: string): IoTComponent | undefined {
		return this.components.find(c => c.id === id);
	}

	public getComponents(): Array<IoTComponent> {
		return this.components;
	}

	public addComponent(component: IoTComponent) {
		component.setComponentManager(this);
		this.components.push(component);
		this.render();
		return component;
	}

	public removeComponent(component: IoTComponent) {
		this.components = this.components.filter(c => c !== component);
		this.render();
		return component;
	}

	public save() {}

	public send(target: IoTTarget) {}

	public render() {
		this.onRender(this.components);
	}
}