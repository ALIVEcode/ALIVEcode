import styled from 'styled-components';

export const StyledIoTProgressBar = styled.div`
	text-align: center;

	.my-progress {
		position: relative;
		margin: 4px;
		float: left;
		text-align: center;
	}

	.barOverflow {
		/* Wraps the rotating .bar */
		position: relative;
		overflow: hidden; /* Comment this line to understand the trick */
		width: 180px;
		height: 90px; /* Half circle (overflow) */
		margin-bottom: -14px; /* bring the numbers up */
	}

	.bar {
		position: absolute;
		top: 0;
		left: 0;
		width: 180px;
		height: 180px; /* full circle! */
		border-radius: 50%;
		box-sizing: border-box;
		border: 15px solid #bbb; /* half gray, */
		border-bottom-color: var(--contrast-color); /* half azure */
		border-right-color: var(--contrast-color);
		transform: rotate(45deg);
		transition: 0.2s;
	}

	.my-progress-span {
		position: relative;
		font-size: 1.2em;
		bottom: 20px;
	}
`;
