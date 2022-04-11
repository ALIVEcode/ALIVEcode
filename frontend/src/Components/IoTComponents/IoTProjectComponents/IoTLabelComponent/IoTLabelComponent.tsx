import Badge from '../../../UtilsComponents/Badge/Badge';
import { IoTLabelComponentProps } from './IoTLabelComponentTypes';
import { useTranslation } from 'react-i18next';

const IoTLabelComponent = ({ component }: IoTLabelComponentProps) => {
	const { t } = useTranslation();
	return (
		<Badge
			className="mt-2"
			style={{ fontSize: `${component.getFontSize()}px` }}
			variant="primary"
		>
			{component.displayedValue != null ? (
				component.displayedValue
			) : (
				<i className="font-bold text-red-600">
					{t('iot.project.interace.errors.ref')}
				</i>
			)}
		</Badge>
	);
};

export default IoTLabelComponent;
