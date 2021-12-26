import { Exclude, Expose } from 'class-transformer';
import { IoTComponent, IOT_COMPONENT_TYPE } from '../IoTComponent';

@Exclude()
export class IoTProgressBar extends IoTComponent {
	public value: number;
	@Expose()
	public max: number = 100;
	@Expose()
	public min: number = 0;
	@Expose()
	public isPercentage: boolean = true;

	public type = IOT_COMPONENT_TYPE.PROGRESS_BAR;

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

export const createDefaultIoTProgressBar = () => {
	const progress = new IoTProgressBar();
	progress.value = 10;
	progress.name = 'Default Progress';
	progress.id = '';
	progress.min = 0;
	progress.max = 100;
	progress.isPercentage = true;

	return progress;
};