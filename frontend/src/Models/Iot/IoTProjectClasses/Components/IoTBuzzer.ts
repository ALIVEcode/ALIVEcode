import { Exclude, Expose } from 'class-transformer';
import { IoTComponent, IOT_COMPONENT_TYPE } from '../IoTComponent';
import { Oscillator } from 'tone';

@Exclude()
export class IoTBuzzer extends IoTComponent {
	public value: number = 500;
	public type = IOT_COMPONENT_TYPE.BUZZER;

	@Expose()
	private soundDuration: number = 1;

	@Expose()
	private frequencyType: OscillatorType = 'sine';

	private buzzing: boolean = false;
	private osc: Oscillator | null = null;
	private oscTimeout: NodeJS.Timeout | null = null;

	setValue(val: any) {
		const num = Number(val);
		if (isNaN(num)) return;
		super.setValue(num);
	}

	update(data: any): void {
		this.setValue(data);
		if (this.buzzing) {
			this.stopBuzz();
		}
		this.buzz();
	}

	public buzz() {
		if (!this.buzzing) {
			this.osc = new Oscillator(this.value, this.frequencyType)
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

export const createDefaultIoTBuzzer = () => {
	const label = new IoTBuzzer();
	label.name = 'Default Buzzer';

	return label;
};