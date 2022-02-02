import { IotRoute } from '../../../../Models/Iot/IoTroute.entity';
import styled from 'styled-components';

export type IoTRouteCardProps = {
	route: IotRoute;
};

export const StyledRouteCard = styled.div`
	background-color: var(--bg-shade-two-color);
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 5px 10px 5px 10px;

	.icon {
		color: var(--foreground-color);
		transition: 0.1s;
		cursor: pointer;
		margin-left: 10px;
	}

	.icon:hover {
		color: rgba(var(--foreground-color-rgb), 0.3);
	}
`;