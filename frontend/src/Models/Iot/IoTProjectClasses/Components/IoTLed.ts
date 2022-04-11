import { Exclude } from 'class-transformer';
import { IoTComponent, IOT_COMPONENT_TYPE } from '../IoTComponent';
import { TFunction } from 'i18next';

export enum LED_STATE {
	ON = 'ON',
	OFF = 'OFF',
}

@Exclude()
export class IoTLed extends IoTComponent {
	public defaultValue: boolean = false;
	public value: boolean = false;
	public type = IOT_COMPONENT_TYPE.LED;

	public validate(val: any) {
		return typeof val === 'boolean';
	}

	setValue(val: boolean) {
		super.setValue(val);
	}

	update(data: any): void {
		if (typeof data !== 'boolean') return;
		this.setValue(data);
		this.getComponentManager()?.render();
	}
}

export const createDefaultIoTLed = (t: TFunction) => {
	const led = new IoTLed();
	led.value = false;
	led.name = t('iot.project.interface.components.led.name');

	return led;
};
