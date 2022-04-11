import { IoTProgressBar } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTProgressBar';
import { StyledIoTProgressBar } from './iotProgressBarComponentTypes';
import { useTranslation } from 'react-i18next';

const IoTProgressBarComponent = ({
	component,
}: {
	component: IoTProgressBar;
}) => {
	const { t } = useTranslation();
	const percentage =
		component.displayedValue != null
			? (component.displayedValue - component.getMin()) /
			  (component.getMax() - component.getMin())
			: 0;

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
					{component.displayedValue ?? t('iot.project.interace.errors.ref')}
					{component.isPercentage && '%'}
					{!component.displayedValue && !component.isPercentage && '\u00A0'}
				</span>
			</div>
		</StyledIoTProgressBar>
	);
};

export default IoTProgressBarComponent;
