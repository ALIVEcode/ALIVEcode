import MessageForm from '../../Components/Chat/MessageForm/messageForm';
import RoomList from '../../Components/Chat/RoomList/roomList';
import { useState } from 'react';

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
				<div className="chat flex flex-row">
					<RoomList setActiveTopic={setActiveTopic} />
					<MessageForm activeTopic={activeTopic} />
				</div>
			</div>
		</div>
	);
};

export default Chat;
