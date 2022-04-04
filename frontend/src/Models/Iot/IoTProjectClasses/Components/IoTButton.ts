import { Exclude, Expose } from 'class-transformer';
import { IoTComponent, IOT_COMPONENT_TYPE } from '../IoTComponent';
import { TFunction } from 'i18next';

@Exclude()
export class IoTButton extends IoTComponent {
	public defaultValue: string = '';
	public value: string = '';
	public type = IOT_COMPONENT_TYPE.BUTTON;

	public validate(val: any) {
		return typeof val === 'string';
	}

	@Expose()
	private targetId?: string | null = null;

	@Expose()
	private actionId: number = 0;

	@Expose()
	private actionData: string = '{}';

	public setTargetId(id: string) {
		this.targetId = id;
		this.getComponentManager()?.render();
	}

	public getTargetId() {
		return this.targetId;
	}

	public setActionId(id: number) {
		this.actionId = id;
		this.getComponentManager()?.render();
	}

	public getActionId() {
		return this.actionId;
	}

	public setActionData(data: string) {
		this.actionData = data;
		this.getComponentManager()?.render();
	}

	public getActionData() {
		return this.actionData;
	}

	public onClick() {
		if (this.targetId != null)
			this.getComponentManager()
				?.getSocket()
				.sendAction(this.targetId, this.actionId, this.actionData);
	}

	update(data: any): void {
		this.value = data;
	}
}

export const createDefaultIoTButton = (t: TFunction) => {
	const button = new IoTButton();
	button.name = t('iot.project.interface.components.button.name');
	button.value = t(
		'iot.project.interface.components_form.button.value.placeholder',
	);
	button.id = '';

	return button;
};
