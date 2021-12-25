import MessageForm from '../../Components/Chat/MessageForm/messageForm';
import styled from 'styled-components';
import CenteredContainer from '../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import RoomList from '../../Components/Chat/RoomList/roomList';
import { useState } from 'react';

const StyledCenteredContainer = styled(CenteredContainer)`
	display: flex;
	width: 100%;
	.row-prof {
		margin-top: 10px;
		margin-bottom: 10px;
	}
`;

const Chat = () => {
	const [activeTopic, setActiveTopic] = useState<string>('');
	return (
		<div className="section">
			<div
				className="top"
				style={{
					backgroundColor: '#0177bc',
					color: '#FFF',
					textAlign: 'center',
				}}
			>
				<h1>REACT CHAT APPLICATION</h1>
				<h1>{activeTopic}</h1>
			</div>
			<div className="Chat">
				<StyledCenteredContainer className="chat">
					<RoomList setActiveTopic={setActiveTopic} />
					<MessageForm activeTopic={activeTopic} />
				</StyledCenteredContainer>
			</div>
		</div>
	);
};

export default Chat;