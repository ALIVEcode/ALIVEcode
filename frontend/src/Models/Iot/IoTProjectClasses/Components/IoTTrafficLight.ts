import { Exclude } from 'class-transformer';
import { IoTComponent, IOT_COMPONENT_TYPE } from '../IoTComponent';
import { TFunction } from 'i18next';

export enum TRAFFIC_LIGHT_STATE {
	RED = 'RED',
	YELLOW = 'YELLOW',
	GREEN = 'GREEN',
	OFF = 'OFF',
}

@Exclude()
export class IoTTrafficLight extends IoTComponent {
	public defaultValue: boolean = false;
	public value: TRAFFIC_LIGHT_STATE = TRAFFIC_LIGHT_STATE.OFF;
	public type = IOT_COMPONENT_TYPE.TRAFFIC_LIGHT;

	public validate(val: any) {
		return (
			typeof val === 'string' &&
			(val.toUpperCase() === TRAFFIC_LIGHT_STATE.GREEN ||
				val.toUpperCase() === TRAFFIC_LIGHT_STATE.YELLOW ||
				val.toUpperCase() === TRAFFIC_LIGHT_STATE.RED ||
				val.toUpperCase() === TRAFFIC_LIGHT_STATE.OFF)
		);
	}

	setValue(val: TRAFFIC_LIGHT_STATE) {
		super.setValue(val);
	}

	update(data: any): void {
		if (!this.validate(data)) return;
		this.setValue(data);
		this.getComponentManager()?.render();
	}
}

export const createDefaultTrafficLight = (t: TFunction) => {
	const traffic_light = new IoTTrafficLight();
	traffic_light.name = t('iot.project.interface.components.traffic_light.name');

	return traffic_light;
};
