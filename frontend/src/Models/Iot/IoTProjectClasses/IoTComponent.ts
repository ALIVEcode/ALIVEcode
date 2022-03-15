import { Exclude, Expose, Transform } from 'class-transformer';
import { IoTComponentManager } from './IoTComponentManager';

export enum IOT_COMPONENT_TYPE {
	BUTTON,
	PROGRESS_BAR,
	LOGS,
	LED,
	LABEL,
	BUZZER,
	TRAFFIC_LIGHT,
}

@Exclude()
export abstract class IoTComponent {
	@Expose()
	public id: string = '';

	@Expose()
	public name: string;

	@Expose()
	public abstract type: IOT_COMPONENT_TYPE;

	@Expose()
	@Transform(({ value }) => {
		// Transform arrays
		if (Array.isArray(value)) {
			value = value.map(v => {
				// Transform dates
				if ('date' in v) v.date = new Date(v.date);
				return v;
			});
		}
		return value;
	})
	public abstract value: any | string;
	public abstract defaultValue: any;
	private refValue: any = undefined;

	public updateRef() {
		if (this.isRef()) this.refValue = this.getValueByRef();
	}

	public setName(newName: string) {
		this.name = newName;
		this.getComponentManager()?.render();
	}

	public setId(newId: string) {
		this.id = newId;
		this.getComponentManager()?.render();
	}

	public setValue(newValue: any) {
		this.refValue = undefined;
		this.value = newValue;
		this.getComponentManager()?.render();
	}

	public isRef() {
		return (
			typeof this.value === 'string' &&
			this.value.match(/^\/document([^\s]+)$/) != null
		);
	}

	public isRefValueValid() {
		if (!this.isRef()) return true;
		return this.validate(this.displayedValue);
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
		if (this.isRef()) {
			if (this.refValue == null) this.refValue = this.getValueByRef();
			return this.refValue;
		}
		return this.value;
	}

	public reset() {
		this.setValue(this.defaultValue);
	}

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
