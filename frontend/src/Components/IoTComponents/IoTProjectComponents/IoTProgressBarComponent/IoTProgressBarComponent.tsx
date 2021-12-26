import { IoTProgressBar } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTProgressBar';
import { StyledIoTProgressBar } from './iotProgressBarComponentTypes';

const IoTProgressBarComponent = ({
	component,
}: {
	component: IoTProgressBar;
}) => {
	const percentage =
		(component.value - component.getMin()) /
		(component.getMax() - component.getMin());

	return (
		<StyledIoTProgressBar>
			<div className="my-progress">
				<div className="barOverflow">
					<div
						className="bar"
						style={{
							transform: `rotate(${
								(percentage <= 1 ? (percentage >= 0 ? percentage : 0) : 1) *
									180 +
								45
							}deg)`,
						}}
					></div>
				</div>
				<span className="my-progress-span">
					{component.value}
					{component.isPercentage && '%'}
					{!component.value && !component.isPercentage && '\u00A0'}
				</span>
			</div>
		</StyledIoTProgressBar>
	);
};

export default IoTProgressBarComponent;