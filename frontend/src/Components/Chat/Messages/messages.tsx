import { MessagesProp } from './messagesType';
import Jihene from '../../../assets/images/creators/Jihene.jpg';

const Messages = ({ username, text, time, image }: MessagesProp) => {
	return (
		<div style={{ paddingTop: '5px' }}>
			<div>
				<img
					className="message-image rounded-circle"
					style={{ width: '45px', maxHeight: '45px' }}
					alt={image}
					src={image ? `http://localhost:8000/uploads/${image}` : Jihene}
				/>
				<div>
					<div
						className="message-user"
						style={{
							paddingLeft: '10px',
							fontWeight: 'bold',
							fontSize: '18px',
						}}
					>
						{username}{' '}
					</div>
					<div className="message-text" style={{ paddingLeft: '10px' }}>
						{text}
					</div>
				</div>
				<div
					className="message-time"
					style={{ fontSize: '12px', paddingLeft: '10px', paddingTop: '5px' }}
				>
					{time}
				</div>
			</div>
		</div>
	);
};
export default Messages;
