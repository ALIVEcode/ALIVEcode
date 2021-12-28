import styled from 'styled-components';
import { Classroom } from '../../Models/Classroom/classroom.entity';
export type DashboardNewProps = {};

export type SwitchTabActions = {
	type: 'recents' | 'summary' | 'classrooms';
	classroom?: Classroom;
};

export const StyledDashboard = styled.div`
	display: table;
	height: 100%;
	width: 100%;
	box-sizing: border-box;
	background-color: var(--background-color);
	font-family: var(--oxygen-font);

	.dashboard-row {
		position: relative;
		height: 100%;
		display: table-row;
	}

	.dashboard-row .no-float {
		display: table-cell;
		vertical-align: top;
	}

	.content {
		padding: 0;
	}

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
		margin-right: 10px;
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

	.sidebar-classroom {
		color: var(--fg-shade-three-color);
		font-weight: 400;
		padding: 10px 15px 10px 15px;
		cursor: pointer;
	}

	.sidebar-classroom .sidebar-icon {
		font-size: 0.8em;
	}

	.sidebar-classroom-text {
		font-size: 0.8em;
		height: 20px;
		cursor: pointer;
	}

	.sidebar-course {
		font-weight: 400;
		padding: 10px 10px 10px 30px;
		cursor: pointer;
	}

	.sidebar-course .sidebar-icon {
		font-size: 0.9em;
	}

	.sidebar-course-text {
		font-size: 0.8em;
		height: 20px;
		cursor: pointer;
	}

	hr {
		margin-top: 0;
		width: 90%;
		border-color: var(--bg-shade-three-color) !important;
	}
`;