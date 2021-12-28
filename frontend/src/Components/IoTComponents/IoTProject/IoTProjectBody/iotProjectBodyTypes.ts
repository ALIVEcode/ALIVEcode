import styled from 'styled-components';
import { IoTProject } from '../../../../Models/Iot/IoTproject.entity';

export type IoTProjectBodyProps = {
	project: IoTProject;
	canEdit?: boolean;
};

export const StyledIoTProjectBody = styled.div`
	position: relative;
	overflow-y: auto;
	width: 100%;

	height: ${({ noTopRow }: { noTopRow?: boolean }) =>
		noTopRow ? `100%` : `calc(100% - 65px)`};
	padding: 20px;
`;