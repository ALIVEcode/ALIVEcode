import { MessageFormProp } from './messageFormType';
import { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserContext } from '../../../state/contexts/UserContext';
import Messages from '../Messages/messages';
import Picker, { IEmojiData } from 'emoji-picker-react';
type Users = {
	name: string;
};
const MessageForm = ({ activeTopic }: MessageFormProp) => {
	const { user } = useContext(UserContext);
	const { handleSubmit } = useForm();
	const socket = useRef<WebSocket>();
	const [messages, setMessages] = useState<string[]>([]);
	const [users, setUsers] = useState<Users[]>([]);
	const [input, setInput] = useState<string>('');
	const inputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (!user) return;

		if (!process.env.CHAT_URL)
			throw new Error('CHAT_URL .env variable not set');

		socket.current = new WebSocket(process.env.CHAT_URL);

		socket.current.onopen = () => {
			console.log('Connected to Chat');
			if (socket.current)
				socket.current.send(
					JSON.stringify({
						event: 'user_connected',
						data: {
							name: user.getDisplayName(),
						},
					}),
				);
		};

		socket.current.onmessage = (e: MessageEvent) => {
			const data = JSON.parse(e.data);
			if (data.event === 'messageToClient') {
				const message = data;
				const incomingMessage = {
					...message,
					ownedByCurrentUser:
						message.data.message_user === user.getDisplayName(),
				};
				setMessages(messages => [...messages, incomingMessage]);
			}
			if (data.event === 'user_connected') {
				setUsers(data.data);
			}
		};

		socket.current.onclose = () => {
			console.log('disconnected');
		};
	}, [user, socket]);
	const onSubmit = () => {
		const today = new Date();
		if (socket.current)
			socket.current.send(
				JSON.stringify({
					event: 'send_message',
					data: {
						active_topic: activeTopic,
						message_user: user?.getDisplayName(),
						image_user: user?.getDisplayImage(),
						message: input,
						time:
							today.getHours() +
							':' +
							today.getMinutes() +
							':' +
							('0' + (today.getSeconds() + 1)).slice(-2),
					},
				}),
			);
		setInput('');
	};

	const onEmojiClick = (event: Event, emojiObject: IEmojiData) => {
		setInput((prevInput: string) => prevInput + emojiObject.emoji);
	};

	return (
		<div className="flex flex-row w-full h-full bg-[color:var(--background-color)]">
			<div className="w-1/2 h-full">
				<div>
					<div
						className="card-container-body"
						style={{
							overflow: 'auto',
							height: ' 530px',
							borderRadius: 1,
							overflowY: 'auto',
						}}
					>
						{messages.map((message: any, idx) => {
							return (
								activeTopic === message.data.active_topic && (
									<Messages
										key={idx}
										username={
											message.data.message_user !== `${user?.getDisplayName()}`
												? message.data.message_user
												: 'yourself'
										}
										image={message.data.image_user}
										text={message.data.message}
										time={message.data.time}
									/>
								)
							);
						})}
					</div>
					<div>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="flex flex-row">
								<div className="input-group mb-10">
									<input
										className="form-control"
										type="text"
										ref={inputRef}
										placeholder="Entrer votre message"
										value={input}
										onChange={e => setInput(e.target.value)}
									/>
									<button
										className="btn"
										style={{ background: '#0177bc' }}
										type="submit"
									>
										Send
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
			<div className="w-1/2">
				<div className="h-full">
					<div className="list-group">
						{users.map((userConnected: any, idx) => {
							return (
								<div className="list-group-item " key={idx}>
									{userConnected.name !== `${user?.getDisplayName()}`
										? userConnected.name
										: `${userConnected.name} (me)`}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};
export default MessageForm;
