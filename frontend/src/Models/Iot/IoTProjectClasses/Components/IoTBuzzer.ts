import { Exclude, Expose } from 'class-transformer';
import { IoTComponent, IOT_COMPONENT_TYPE } from '../IoTComponent';
import { Oscillator } from 'tone';
import { TFunction } from 'i18next';

@Exclude()
export class IoTBuzzer extends IoTComponent {
	public defaultValue: number = 500;
	public value: number = 500;
	public type = IOT_COMPONENT_TYPE.BUZZER;

	public validate(val: any) {
		return typeof val === 'number';
	}

	@Expose()
	private soundDuration: number = 1;

	@Expose()
	private frequencyType: OscillatorType = 'sine';

	private buzzing: boolean = false;
	private osc: Oscillator | null = null;
	private oscTimeout: NodeJS.Timeout | null = null;

	update(data: any): void {
		this.setValue(data);
		if (this.buzzing) {
			this.stopBuzz();
		}
		this.buzz();
	}

	public buzz() {
		if (!this.buzzing) {
			this.osc = new Oscillator(this.displayedValue, this.frequencyType)
				.toDestination()
				.start();
			this.buzzing = true;
			this.getComponentManager()?.render();
			this.oscTimeout = setTimeout(() => {
				this.buzzing = false;
				this.osc?.stop();
				this.getComponentManager()?.render();
			}, this.soundDuration * 1000);
		}
	}

	public stopBuzz() {
		if (this.buzzing) {
			this.oscTimeout && clearTimeout(this.oscTimeout);
			this.buzzing = false;
			this.osc?.stop();
			this.getComponentManager()?.render();
		}
	}

	public isBuzzing() {
		return this.buzzing;
	}

	public getSoundDuration() {
		return this.soundDuration;
	}

	public setSoundDuration(soundDuration: number) {
		this.soundDuration = soundDuration;
		this.getComponentManager()?.render();
	}

	public getFrequencyType() {
		return this.frequencyType;
	}

	public setFrequencyType(frequencyType: OscillatorType) {
		this.frequencyType = frequencyType;
		this.getComponentManager()?.render();
	}
}

export const createDefaultIoTBuzzer = (t: TFunction) => {
	const buzzer = new IoTBuzzer();
	buzzer.name = t('iot.project.interface.components.buzzer.name');

	return buzzer;
};
