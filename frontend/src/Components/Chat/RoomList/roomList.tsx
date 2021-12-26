import {RoomListProp} from './roomlistType' 
import { useContext, useEffect, useState } from 'react';
import { Card, Row } from 'react-bootstrap';
import './roomlist.css';
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
			console.log(resultTopics);
			setTopics(resultTopics);
			setActiveTopic(resultTopics[0].name);
		}
		getTopics();
	}, [user, setActiveTopic]);
	console.log();
	return (
		<div className="text-left col-sm-3">
			<Card style={{ height: '100%' }}>
				<Row
					className="justify-content-md-center"
					style={{ paddingTop: '1rem', height: '100px' }}
				>
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
				</Row>
				<Row className="justify-content-md-center">
					<h3>{user?.getDisplayName()}</h3>
				</Row>{' '}
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
			</Card>
		</div>
	);
};
export default RoomList;
