import Badge from '../../../UtilsComponents/Badge/Badge';
import { IoTLabelComponentProps } from './IoTLabelComponentTypes';
import { useContext } from 'react';
import { IoTProjectContext } from '../../../../state/contexts/IoTProjectContext';
import { useAlert } from 'react-alert';

const IoTLabelComponent = ({ component }: IoTLabelComponentProps) => {
	const { project } = useContext(IoTProjectContext);
	const alert = useAlert();

	return (
		<Badge
			className="mt-2"
			style={{ fontSize: `${component.getFontSize()}px` }}
			variant="primary"
		>
			{component.displayedValue}
		</Badge>
	);
};

export default IoTLabelComponent;
