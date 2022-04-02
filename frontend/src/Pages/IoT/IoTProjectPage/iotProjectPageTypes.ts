import styled from 'styled-components';

export type IoTProjectOptions = 'settings' | 'routes';
export type IoTProjectTabs = 'documents' | 'scripting' | 'interface';
export type IoTProjectTab = {
	name: string;
	type: IoTProjectTabs;
};

export const StyledIoTProject = styled.div`
	background-color: var(--background-color);

	#project-details {
		padding: 0;
		background-color: var(--background-color);
		border-right: var(--bg-shade-four-color) 1px solid;
		position: relative;
		vertical-align: bottom;
	}

	.main-row {
		height: 100%;
		display: table-row;
	}

	.row .no-float {
		display: table-cell;
		float: none;
	}

	.project-top-row {
		height: 50px;
		padding: 10px !important;
		border-bottom: var(--bg-shade-four-color) 1px solid;
	}

	.project-details-body {
		height: calc(100% - 50px);
	}

	.project-details-tabs {
		width: 70px;
		flex-grow: 0;
		text-align: center;
	}

	.project-details-tab {
		width: 70px;
		height: 70px;
		padding: 10px !important;
		background-color: var(--background-color);
		font-size: 0.75em;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		transition: 0.05s;
		cursor: pointer;
	}

	.project-details-tab-selected {
		background-color: var(--bg-shade-three-color);
	}

	.project-details-tab:hover {
		background-color: var(--bg-shade-one-color);
	}

	.project-details-content {
		border-left: var(--bg-shade-four-color) 1px solid;
		padding: 10px !important;
	}

	.project-details-content-header {
		border-bottom: var(--bg-shade-four-color) 1px solid;
		font-size: 1.2em;
		height: 40px;
		margin-bottom: 20px;
	}

	.disabled-text {
		color: rgba(var(--foreground-color-rgb), 0.5);
	}

	.row,
	.col,
	.col-sm-8,
	.col-sm-4 {
		padding: 0;
		margin: 0;
	}
`;
