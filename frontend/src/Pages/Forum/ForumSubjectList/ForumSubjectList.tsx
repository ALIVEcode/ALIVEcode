import { plainToClass } from "class-transformer";
import { useEffect, useState } from "react";
import { Card, Col, ListGroup, Row } from 'react-bootstrap';
import CardContainer from '../../../Components/UtilsComponents/CardContainer/CardContainer';
import CenteredContainer from '../../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import api from '../../../Models/api';
import { CategorySubject } from '../../../Models/Forum/categorySubject.entity';
import { Subject } from '../../../Models/Forum/subjects.entity';
import ForumNavbar from '../ForumNavbar/ForumNavbar';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';

const ForumSubjectList = () => {
	const [category, setCategory] = useState<CategorySubject>();
	const [subject, setSubject] = useState<Subject[]>([]);
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		if (!id) return;
		const getSubject = async () => {
			const data = await api.db.forum.categories.getById({
				id,
			});
			const subjectdata = data.subjects;
			setSubject(subjectdata.map((d: any) => plainToClass(Subject, d)));
			setCategory(data);
		};
		getSubject();
	}, [id]);

	return (
		<div>
			<CenteredContainer
				horizontally
				textAlign="center"
				style={{ paddingLeft: '100px', paddingRight: '100px' }}
			>
				<ForumNavbar />
				<CardContainer asRow title={'Liste des sujets de : ' + category?.name}>
					<Row>
						{subject.map((s, idx) => (
							<div key={idx}>
								<Col>
									<Card style={{ width: '25rem' }}>
										<Card.Header className="bg-secondary">
											<Card.Title as="h5">{s.name}</Card.Title>
										</Card.Header>
										<ListGroup variant="flush">
											{s.posts.map((p, idx) => (
												<ListGroup.Item key={idx}>
													<Card>
														<Link to={'/forum/post/' + s.id}>
															<Card.Title>{p.title}</Card.Title>
														</Link>
														<Card.Footer>
															{p.created_at + ' ' + p.creator.email}
														</Card.Footer>
													</Card>
												</ListGroup.Item>
											))}
										</ListGroup>
									</Card>
								</Col>
							</div>
						))}
					</Row>
				</CardContainer>
			</CenteredContainer>
		</div>
	);
};

export default ForumSubjectList;
