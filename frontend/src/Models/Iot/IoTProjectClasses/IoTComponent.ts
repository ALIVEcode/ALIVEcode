import { Exclude, Expose, Transform } from 'class-transformer';
import { IoTComponentManager } from './IoTComponentManager';

export enum IOT_COMPONENT_TYPE {
	BUTTON,
	PROGRESS_BAR,
	LOGS,
	LED,
	LABEL,
	BUZZER,
}

@Exclude()
export abstract class IoTComponent {
	@Expose()
	public id: string = '';

	@Expose()
	public name: string;

	public setName(newName: string) {
		this.name = newName;
		this.getComponentManager()?.render();
	}

	public setId(newId: string) {
		this.id = newId;
		this.getComponentManager()?.render();
	}

	public setValue(newValue: any) {
		this.value = newValue;
		this.getComponentManager()?.render();
	}

	@Expose()
	public abstract type: IOT_COMPONENT_TYPE;

	@Expose()
	@Transform(({ value }) => {
		// Transform arrays
		if (Array.isArray(value)) {
			value = value.map(v => {
				// Transform dates
				if (v.date) v.date = new Date(v.date);
				return v;
			});
		}
		return value;
	})
	public abstract value: any;

	private componentManager: IoTComponentManager | null = null;

	public setComponentManager(componentManager: IoTComponentManager) {
		this.componentManager = componentManager;
	}

	abstract update(data: any): void;

	public getComponentManager(): IoTComponentManager | null {
		return this.componentManager;
	}
}