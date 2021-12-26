import Button from '../../Components/UtilsComponents/Button/Button';
import CenteredContainer from '../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import CardContainer from '../../Components/UtilsComponents/CardContainer/CardContainer';
import { Card, Col, Row } from 'react-bootstrap';
import NavBarSocial from './NavBarSocial';
import { Post as PostModel } from '../../Models/Forum/post.entity';
import { useEffect, useState } from 'react';
import api from '../../Models/api';
import { plainToClass } from 'class-transformer';
import { Link } from 'react-router-dom';



const Forum = () => {

	const [post, setPost] = useState<PostModel[]>([]);

	
	useEffect(() => {
		const getPost = async () => {
			const data = await api.db.forum.getLastPost({});
			setPost(data.map((d: any) => plainToClass(PostModel, d)))
		};
		getPost();
	}, [])
	
	return (
		<div>
            <CenteredContainer
				horizontally
				textAlign="center"
				style={{ paddingLeft: '100px', paddingRight: '100px' }}
			>
			<div>
			<NavBarSocial/>
			</div>
			
			<Row>
				<Col className="col-8">
					<CardContainer asRow title="Forum">
							<div className="text-left ml-3" style={{ height: '22rem' }}>
							Règles<br/>
								- Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
								<br/>
								- Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
								<br/>
								- Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
							</div>
					</CardContainer>
					{/*
					<CardContainer asRow title="Iot">
						<Row>
							<Col className="border-right border-dark">
								<div className="media">
									<img className="mr-3 rounded-circle" src="https://bulma.io/images/placeholders/64x64.png" alt=""/>
									<div className="text-left">
										Iot
									</div>
								</div>
							</Col>
							<Col className="border-right border-dark">
								<div className="text-left">
									111 sujets
								</div>
								<div className="text-left">
									2322 messages
								</div>
							</Col>
							<Col>
								<div className="text-left">
									date dernier post
								</div>
							</Col>	
						</Row>
					</CardContainer>

					<CardContainer asRow title="Programmation">
						<div>
							<Row>
								<Col className="border-right border-dark">
									<div className="media">
										<img className="mr-3 rounded-circle" src="https://bulma.io/images/placeholders/64x64.png" alt=""/>
										<div className="text-left">
											Javascript
										</div>
									</div>
								</Col>
								<Col className="border-right border-dark">
									<div className="text-left">
										111 sujets
									</div>
									<div className="text-left">
										2322 messages
									</div>
								</Col>
								<Col>
								<div className="text-left">
									date dernier post
								</div>
								</Col>
							</Row>
						</div>
					</CardContainer>
					*/}
				</Col>
				
				<Col>
					<Col>
						<Link to='/formQuestion/forum'>
							<Button variant={'primary'} className="btn-lg mt-5">Créer un sujet</Button>
						</Link>
						<CardContainer asRow title="Derniers sujets">
							<div>
							{post.map((p, idx) => 
							<Link to={'/forum/post/'+ p.id} key={idx}>
							<Card className="ml-2 mr-2 mt-2" style={{ width: '22rem' }}>
								<div className="card-content">
									<div className="media">
										<img className="rounded-circle mt-1 ml-1 mr-3" src="https://bulma.io/images/placeholders/64x64.png" alt=""/>
										{p.creator && <Card.Title className="mt-1 mr-1">{p.creator.email}</Card.Title>}
									</div>
								</div>
								<Card.Text className="ml-2">
									{p.title}
									<br/>
									<Card.Text><small className="text-muted">{p.created_at}</small></Card.Text>
								</Card.Text>
							</Card>
							</Link>
							)}
							</div>
						</CardContainer>
					</Col>
				</Col>
			</Row>	
            </CenteredContainer>
		</div>
	);
};

export default Forum;