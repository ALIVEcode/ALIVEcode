import { Maintenance } from '../../../Models/Maintenance/maintenance.entity';
import styled from 'styled-components';

export type MaintenanceBarProps = {
	maintenance: Maintenance;
	onClose: () => void;
};

export const StyledMaintenanceBar = styled.div`
	position: fixed;
	width: 100%;
	bottom: 0;
	padding: 30px 20px 30px 20px;
	background-color: var(--primary-color);
	display: flex;
	justify-content: space-around;
	flex-direction: column;
	z-index: 50;

	label {
		text-align: center;
		margin-bottom: 0;
	}

	.maintenance-info {
		font-size: 0.9em;
		margin-bottom: 10px;
	}

	.maintenance-title {
		font-size: 1.2em;
	}

	.close-icon {
		color: var(--foreground-color);
		position: absolute;
		right: 15px;
		top: 15px;
		transition: 0.1s;
		cursor: pointer;
	}

	.close-icon:hover {
		color: rgba(var(--foreground-color-rgb), 0.6);
	}
`;
