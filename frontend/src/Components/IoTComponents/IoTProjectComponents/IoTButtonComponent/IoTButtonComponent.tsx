import Button from '../../../UtilsComponents/Buttons/Button';
import { IoTButtonComponentProps } from './IoTButtonComponentTypes';
import { useTranslation } from 'react-i18next';

const IoTButtonComponent = ({ component }: IoTButtonComponentProps) => {
	const { t } = useTranslation();

	return (
		<Button onClick={() => component.onClick()} variant="third">
			{component.displayedValue != null ? (
				component.displayedValue
			) : (
				<i className="font-bold text-red-600">
					{t('iot.project.interface.errors.ref')}
				</i>
			)}
		</Button>
	);
};

export default IoTButtonComponent;
