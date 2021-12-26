import { Classroom } from '../../../Models/Classroom/classroom.entity';
import styled from 'styled-components';

export type ClassRoomCardProps = {
	classroom: Classroom;
};

export const StyledClassroomCard = styled.div`
	/* The flip card container - set the width and height to whatever you want. We have added the border property to demonstrate that the flip itself goes out of the box on hover (remove perspective if you don't want the 3D effect */
	background-color: transparent;
	margin: auto;
	width: 25em;
	height: 20em;
	perspective: 1000px; /* Remove this if you don't want the 3D effect */
	margin-bottom: 20px;

	/* This container is needed to position the front and back side */
	.flip-card-inner {
		position: relative;
		width: 100%;
		height: 100%;
		text-align: center;
		transition: transform 0.8s;
		transform-style: preserve-3d;
	}

	/* Do an horizontal flip when you move the mouse over the flip box container */
	&:hover .flip-card-inner {
		transform: rotateY(180deg);
	}

	/* Position the front and back side */
	.flip-card-front,
	.flip-card-back {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		-webkit-backface-visibility: hidden; /* Safari */
		backface-visibility: hidden;
		border-radius: 25px;
	}

	/* Style the front side (fallback if image is missing) */
	.flip-card-front {
		background-color: var(--primary-color);
		color: black;
	}

	/* Style the back side */
	.flip-card-back {
		background-color: var(--secondary-color);
		color: white;
		transform: rotateY(180deg);
	}
`;