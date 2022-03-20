import { IoTProject, IoTProjectLayout } from '../IoTproject.entity';
import { IoTTarget } from './IoTTypes';
import { IoTComponent } from './IoTComponent';
import { IoTSocket } from './IoTSocket';

export class IoTComponentManager {
	private project: IoTProject;
	private onRequestRender: (
		saveLayout: boolean,
		layout: Array<IoTComponent>,
	) => void;
	private socket: IoTSocket;

	constructor(
		project: IoTProject,
		onRender: (saveLayout: boolean, layout: Array<IoTComponent>) => void,
		socket: IoTSocket,
	) {
		this.project = project;
		this.onRequestRender = onRender;
		this.socket = socket;

		this.setNewLayout(project.layout);
		this.render();
	}

	public setNewLayout(layout: IoTProjectLayout) {
		this.project.layout.components = layout.components;
		this.project.layout.components = this.project.layout.components.map(c => {
			c.setComponentManager(this);
			return c;
		});
	}

	public getSocket() {
		return this.socket;
	}

	public getProjectDocument() {
		return this.project.document;
	}

	public updateComponent(id: string, data: any) {
		const component = this.getComponent(id);
		if (!component) return;
		component.update(data);
		this.render(false);
	}

	public getComponent(id: string): IoTComponent | undefined {
		return this.project.layout.components.find(c => c.id === id);
	}

	public getComponents(): Array<IoTComponent> {
		return this.project.layout.components;
	}

	public addComponent(component: IoTComponent) {
		component.setComponentManager(this);
		this.project.layout.components.push(component);
		this.render();
		return component;
	}

	public removeComponent(component: IoTComponent) {
		this.project.layout.components = this.project.layout.components.filter(
			c => c !== component,
		);
		this.render();
		return component;
	}

	public save() {}

	public send(target: IoTTarget) {}

	public render(saveLayout?: boolean) {
		this.onRequestRender(
			saveLayout === undefined ? true : saveLayout,
			this.project.layout.components,
		);
	}
}
