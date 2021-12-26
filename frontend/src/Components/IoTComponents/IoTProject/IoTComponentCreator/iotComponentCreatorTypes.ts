import styled from 'styled-components';
import { IoTComponent } from '../../../../Models/Iot/IoTProjectClasses/IoTComponent';

export type IoTComponentCreatorProps = {
	onSelect: (component: IoTComponent) => void;
};

export const StyledIoTComponentCreator = styled.div`
	padding: 15px;
`;