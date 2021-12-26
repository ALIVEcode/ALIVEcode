import { Exclude, Expose } from 'class-transformer';
import { IoTComponent, IOT_COMPONENT_TYPE } from '../IoTComponent';

@Exclude()
export class IoTLabel extends IoTComponent {
	public value: string = 'Unset';
	public type = IOT_COMPONENT_TYPE.LABEL;

	@Expose()
	private fontSize: number = 20;

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

export const createDefaultIoTLabel = () => {
	const label = new IoTLabel();
	label.name = 'Default Label';

	return label;
};