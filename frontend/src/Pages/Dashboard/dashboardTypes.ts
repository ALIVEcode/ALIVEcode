import styled from 'styled-components';
import { Classroom } from '../../Models/Classroom/classroom.entity';
export type DashboardProps = {};

export type DashboardTabs =
	| 'recents'
	| 'challenges'
	| 'iot'
	| 'resources'
	| 'classrooms';

export type SwitchTabActions = {
	tab: DashboardTabs;
	classroom?: Classroom;
};

export const StyledDashboard = styled.div`
	display: table;
	height: 100%;
	width: 100%;
	box-sizing: border-box;
	background-color: var(--background-color);

	.sidebar {
		border-right: 1px solid var(--bg-shade-four-color);
		padding: 0;
	}

	.sidebar label {
		margin-bottom: 0;
	}

	.sidebar-btn {
		color: var(--foreground-color);
		font-weight: 400;
		padding: 10px 15px 10px 15px;
		cursor: pointer;
		transition: all 0.1s;
	}

	.sidebar-btn:hover {
		background-color: var(--bg-shade-one-color);
	}

	.sidebar-selected {
		background-color: var(--secondary-color) !important;
	}

	.sidebar-btn-text {
		font-size: 0.7em;
		height: 20px;
		cursor: pointer;
	}

	.sidebar-icon {
		margin-right: 0.5rem;
	}

	.sidebar-icon-right {
		position: relative;
	}

	.sidebar-header {
		color: var(--foreground-color);
		font-weight: 400;
		padding: 10px 15px 5px 15px;
		margin-top: 30px;
	}

	.sidebar-header .sidebar-icon {
		font-size: 1.2em;
	}

	.sidebar-header-text {
		font-size: 1.2em;
		height: 20px;
	}

	.sidebar-classroom,
	.sidebar-course {
		color: var(--fg-shade-three-color);
		font-weight: 400;
		padding: 10px 15px 10px 15px;
		cursor: pointer;
	}

	.sidebar-classroom .sidebar-icon,
	.sidebar-course .sidebar-icon {
		font-size: 0.8em;
	}

	.sidebar-classroom-text,
	.sidebar-course-text {
		font-size: 0.8em;
		height: 20px;
		cursor: pointer;
	}

	hr {
		margin-top: 0;
		border-color: var(--bg-shade-three-color) !important;
	}
`;
