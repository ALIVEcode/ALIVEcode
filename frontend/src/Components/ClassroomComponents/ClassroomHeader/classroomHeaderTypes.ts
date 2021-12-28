import { Classroom } from "../../../Models/Classroom/classroom.entity";
import styled from 'styled-components';
import { Container } from 'react-bootstrap';

export type ClassroomHeaderProps = {
	classroom: Classroom;
	className?: string;
};

export const StyledClassroomHeader = styled(Container)`
	color: white;
	background-color: var(--primary-color);
	width: 100%;
	position: relative;
	overflow-y: auto;
	padding: 0;

	.header-row {
		padding: 50px 50px 0px 50px;
	}

	svg {
		width: 100%;
	}

	span {
		margin-top: 10px;
		font-size: 20px;
		background-color: var(--secondary-color);
	}

	.classroom-title-name {
		font-size: 2.3em;
		margin-bottom: 0;
		display: block;
	}

	.classroom-title-desc {
		font-size: 1.3em;
		margin-bottom: 0;
	}

	.classroom-buttons {
		text-align: right;
	}

	.classroom-buttons button {
		margin: 10px;
		font-size: 16px;
		font-weight: bold;
	}

	@media screen and (max-width: 991px) {
		.classroom-title {
			text-align: center;
		}

		.classroom-buttons {
			margin-top: 15px;
			text-align: center;
		}

		.classroom-courses {
			margin-top: 50px;
		}

		.classroom-students-body {
			height: calc(50vh - 110px);
		}

		.classroom-courses-body {
			height: calc(55vh - 110px);
		}
	}
`;
