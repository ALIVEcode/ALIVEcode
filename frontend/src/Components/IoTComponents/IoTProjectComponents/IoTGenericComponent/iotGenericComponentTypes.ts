import { IoTComponent } from '../../../../Models/Iot/IoTProjectClasses/IoTComponent';
import styled from 'styled-components';
import { Col } from 'react-bootstrap';

export type IoTGenericComponentProps = {
	component: IoTComponent;
	selectable?: boolean;
	colSize?: number;
	onSelect?: () => void;
	setEditingComponent?: (component: IoTComponent) => void;
};

export const StyledIoTGenericComponent = styled(Col)`
	background-color: var(--bg-shade-one-color);
	margin: 5px !important;
	border-radius: 10px;
	${({ selectable, ishovering }: any) =>
		selectable &&
		ishovering &&
		'transform: scale(105%) rotateZ(2deg); cursor: pointer;'}
	transition: 0.2s;

	label {
		cursor: inherit;
	}

	.component {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 10px;
	}

	.component-btn {
		position: absolute;
		top: 5px;
		background-color: var(--bg-shade-three-color);
		padding: 8px;
		border-radius: 5px;
		cursor: pointer;
		transition: 0.2s;
		${({ ishovering }: any) => (ishovering ? 'opacity: 1;' : 'opacity: 0;')}
	}

	.component-btn:hover {
		background-color: var(--contrast-color);
	}

	.edit-component-btn {
		left: 5px;
	}

	.copyid-component-btn {
		left: 40px;
	}

	.component-name {
		margin-bottom: 0;
		font-size: 1.5em;
		font-weight: 500;
		text-align: center;
		padding-left: 30px;
		padding-right: 30px;
	}
`;