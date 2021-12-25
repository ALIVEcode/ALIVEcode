import controller from '../../assets/images/controller.png';
import './gamepad.css';
import { Col } from 'react-bootstrap';
import styled from 'styled-components';
import CenteredContainer from '../UtilsComponents/CenteredContainer/CenteredContainer';
import React, { useEffect } from 'react';

const StyledDiv = styled(Col)`
	background-color: var(--primary-color);
	width: 500px;
	height: 300px;
	img {
		border-radius: 20px;
		width: 500px;
		height: 300px;
	}
`;

const StyledCenteredContainer = styled(CenteredContainer)`
	padding: 0 0 0 22%;
	.row-prof {
		margin-top: 10px;
		margin-bottom: 10px;
	}
`;
// Hook
const useKeyPress = (targetKey: any) => {
	// State for keeping track of whether key is pressed
	const [keyPressed, setKeyPressed] = React.useState(false);
	console.log(keyPressed);
	// If pressed key is our target key then set to true
	const downHandler = ({ key }: { key: any }) => {
		if (key === targetKey) {
			setKeyPressed(true);
		}
	};
	// If released key is our target key then set to false
	const upHandler = ({ key }: { key: any }) => {
		if (key === targetKey) {
			setKeyPressed(false);
		}
	};
	// Add event listeners
	useEffect(() => {
		window.addEventListener('keydown', downHandler);
		window.addEventListener('keyup', upHandler);
		// Remove event listeners on cleanup
		return () => {
			window.removeEventListener('keydown', downHandler);
			window.removeEventListener('keyup', upHandler);
		};
		// eslint-disable-next-line
	}, []); // Empty array ensures that effect is only run on mount and unmount

	return keyPressed;
};

const GamepadAlive = () => {
	const isStartPressed = useKeyPress(' ');
	const isAPressed = useKeyPress('z');
	const isBPressed = useKeyPress('s');
	const isXPressed = useKeyPress('x');
	const isYPressed = useKeyPress('c');

	return (
		<>
			<StyledCenteredContainer className="container">
				<StyledDiv>
					<img src={controller} alt="" />

					<button
						className={
							'button buttonGamepad btnStart ' + (isStartPressed && 'push')
						}
						id="btnStart"
					>
						Start
					</button>

					<button
						className={'button buttonGamepad  btnA ' + (isAPressed && 'push')}
						id="btnA"
					>
						A
					</button>

					<button
						className={'button buttonGamepad btnB ' + (isBPressed && 'push')}
						id="btnB"
					>
						B
					</button>

					<button
						className={'button buttonGamepad btnX ' + (isXPressed && 'push')}
						id="btnX"
					>
						X
					</button>

					<button
						className={'button buttonGamepad btnY ' + (isYPressed && 'push')}
						id="btnY"
					>
						Y
					</button>
				</StyledDiv>
			</StyledCenteredContainer>
		</>
	);
};

export default GamepadAlive;

