import { Exclude, Expose } from 'class-transformer';
import { IoTComponent, IOT_COMPONENT_TYPE } from '../IoTComponent';
import { TFunction } from 'i18next';

@Exclude()
export class IoTLabel extends IoTComponent {
	public defaultValue: string = 'Unset';
	public value: string = 'Unset';
	public type = IOT_COMPONENT_TYPE.LABEL;

	@Expose()
	private fontSize: number = 20;

	public validate(val: any) {
		return typeof val === 'string';
	}

	setValue(val: any) {
		super.setValue(val.toString());
	}

	update(data: any): void {
		this.setValue(data);
	}

	public getFontSize() {
		return this.fontSize;
	}

	public setFontSize(fontSize: number) {
		this.fontSize = fontSize;
		this.getComponentManager()?.render();
	}
}

export const createDefaultIoTLabel = (t: TFunction) => {
	const label = new IoTLabel();
	label.name = t('iot.project.interface.components.label.name');
	label.value = t(
		'iot.project.interface.components_form.label.value.placeholder',
	);

	return label;
};
