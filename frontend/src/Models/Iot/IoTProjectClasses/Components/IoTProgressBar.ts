import { Exclude, Expose } from 'class-transformer';
import { IoTComponent, IOT_COMPONENT_TYPE } from '../IoTComponent';
import { TFunction } from 'i18next';

@Exclude()
export class IoTProgressBar extends IoTComponent {
	public defaultValue: number = 10;
	public value: number = 10;
	@Expose()
	public max: number = 100;
	@Expose()
	public min: number = 0;
	@Expose()
	public isPercentage: boolean = true;

	public type = IOT_COMPONENT_TYPE.PROGRESS_BAR;

	public validate(val: any) {
		return typeof val === 'number';
	}

	update(data: any): void {
		if (isNaN(data)) return;
		this.value = data;
	}

	public setIsPercentage(newIsPercentage: boolean) {
		this.isPercentage = newIsPercentage;

		this.getComponentManager()?.render();
	}

	public setRange(min: number, max: number) {
		this.min = min;
		this.max = max;

		this.getComponentManager()?.render();
	}

	public getMin(): number {
		return this.min;
	}

	public getMax(): number {
		return this.max;
	}
}

export const createDefaultIoTProgressBar = (t: TFunction) => {
	const progress = new IoTProgressBar();
	progress.name = t('iot.project.interface.components.progress.name');
	progress.id = '';
	progress.min = 0;
	progress.max = 100;
	progress.isPercentage = true;

	return progress;
};
