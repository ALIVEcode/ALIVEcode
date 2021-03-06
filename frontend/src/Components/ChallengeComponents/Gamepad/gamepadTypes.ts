import styled from 'styled-components';
export type GamepadProp  = {}

export const StyledGamepad = styled.div`
	.container {
		position: relative;
		width: 300px;
	}
	.container .btnX {
		position: absolute;
		top: 161px;
		left: 383px;
	}
	.container .btnY {
		position: absolute;
		top: 132px;
		left: 412px;
	}
	.container .btnA {
		position: absolute;
		top: 122px;
		left: 342px;
	}
	.container .btnB {
		position: absolute;
		top: 95px;
		left: 370px;
	}
	.container .btnStart {
		position: absolute;
		top: 120px;
		left: 250px;
	}

	.buttonGamepad {
		transition: transform 0.1s ease-out;
		font-size: 18px;
		font-weight: bold;
		text-align: center;
		cursor: pointer;
		outline: none;
		color: rgb(0, 0, 0);
		border: none;
		border-radius: 15px;
		box-shadow: 0 5px #999;
		word-wrap: break-word;
		max-width: 100%;
	}
	#btnA {
		background-color: #fd0202;
	}
	#btnB {
		background-color: #1302fd;
	}
	#btnY {
		background-color: #ecfd02;
	}
	#btnX {
		background-color: #0afd02;
	}
	#btnStart {
		background-color: #494343;
	}

	.buttonGamepad:hover {
		background-color: #000000;
	}

	.push {
		background-color: #000000;
		box-shadow: 0 0px #666;
		transform: translateY(5px);
	}
`;