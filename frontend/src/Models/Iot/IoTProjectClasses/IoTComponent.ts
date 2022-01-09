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
	public ref: string = '';

	@Expose()
	public name: string;

	public setName(newName: string) {
		this.name = newName;
		this.getComponentManager()?.render();
	}

	public setId(newId: string) {
		this.ref = newId;
		this.getComponentManager()?.render();
	}

	public setValue(newValue: any) {
		this.value = newValue;
		this.getComponentManager()?.render();
	}

	@Expose()
	public abstract type: IOT_COMPONENT_TYPE;

	public isRef() {
		return (
			typeof this.value === 'string' && this.value.match(/^\/document([^\s]+)$/)
		);
	}

	public getValueByRef = () => {
		const doc = this.getComponentManager()?.getProjectDocument();
		if (!doc) return;
		const paths = this.value.split('/').slice(2, this.value.split('/').length);

		const comp = this;
		function getDeepValue(
			obj: { [key: string]: any },
			keys: string[],
			idx: number,
		): undefined | typeof comp.value {
			const val = obj[keys[idx]];
			if (idx === keys.length - 1 && comp.validate(val)) {
				return val;
			} else if (typeof val === 'object') {
				return getDeepValue(val, paths, idx + 1);
			}
		}

		const value = getDeepValue(doc, paths, 0);
		return value;
	};

	public get displayedValue() {
		return this.isRef() ? this.getValueByRef() : this.value;
	}

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
	public abstract value: any | string;

	public abstract validate(val: any): boolean;

	private componentManager: IoTComponentManager | null = null;

	public setComponentManager(componentManager: IoTComponentManager) {
		this.componentManager = componentManager;
	}

	abstract update(data: any): void;

	public getComponentManager(): IoTComponentManager | null {
		return this.componentManager;
	}
}
