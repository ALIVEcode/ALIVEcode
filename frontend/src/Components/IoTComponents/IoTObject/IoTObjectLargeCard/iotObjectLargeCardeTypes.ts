import { IoTObject } from '../../../../Models/Iot/IoTobject.entity';
import styled from 'styled-components';
import { GenericCardProps } from '../../../UtilsComponents/Cards/GenericCard/genericCardTypes';

export interface IoTObjectLargeCardProps extends GenericCardProps {
	object: IoTObject;
	onUpdate: (iotObject: IoTObject) => void;
}

export const StyledIoTObjectCard = styled.div``;