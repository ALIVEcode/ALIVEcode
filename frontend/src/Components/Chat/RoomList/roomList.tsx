import { RoomListProp } from './roomlistType';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../state/contexts/UserContext';
import api from '../../../Models/api';
import { Topics } from '../../../Models/Social/topics.entity';
import Jihene from '../../../assets/images/creators/Jihene.jpg';

const RoomList = ({ setActiveTopic }: RoomListProp) => {
	const [topics, setTopics] = useState<Topics[]>([]);
	const [active, setActive] = useState<Number>(0);
	const { user } = useContext(UserContext);

	useEffect(() => {
		async function getTopics() {
			const resultTopics = await api.db.topics.all({});
			setTopics(resultTopics);
			setActiveTopic(resultTopics[0].name);
		}
		getTopics();
	}, [user, setActiveTopic]);
	return (
		<div className="text-left h-full w-1/4 bg-[color:var(--background-color)]">
			<div className="h-full">
				<div>
					<img
						className="message-image "
						style={{ width: '100px', maxHeight: '100px' }}
						alt="imageUser"
						src={
							user?.getDisplayImage()
								? `http://localhost:8000/uploads/${user?.getDisplayImage()}`
								: Jihene
						}
					/>
				</div>
				<div className="justify-content-md-center">
					<h3>{user?.getDisplayName()}</h3>
				</div>{' '}
				{topics.map((topic, idx) => {
					return (
						<div className="list-group" key={idx}>
							<div
								className={`list-group-item list-group-item-action ${
									topic.id === active ? 'active' : ''
								}`}
								onClick={() => {
									setActiveTopic(topic.name);
									setActive(topic.id);
								}}
							>
								{topic.name}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};
export default RoomList;
