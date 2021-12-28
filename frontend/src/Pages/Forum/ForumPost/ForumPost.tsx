import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import CardContainer from '../../../Components/UtilsComponents/CardContainer/CardContainer';
import CenteredContainer from '../../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import api from '../../../Models/api';
import { Comment } from '../../../Models/Forum/comment.entity';
import { Post } from '../../../Models/Forum/post.entity';
import { UserContext } from '../../../state/contexts/UserContext';
import { useParams } from 'react-router';

const ForumPost = () => {
	const [post, setPost] = useState<Post>();
	const [comments, setComments] = useState<Comment[]>([]);
	const { user } = useContext(UserContext);
	const { id } = useParams<{ id: string }>();

	const { register, handleSubmit } = useForm();
	const onSubmit: SubmitHandler<any> = data => sendForm(data);

	useEffect(() => {
		if (!id) return;
		const getPost = async () => {
			const data = await api.db.forum.getById({ id });
			setPost(data);
			setComments(data.comments);
		};
		getPost();
	}, [id]);

	const sendForm = async (data: Comment) => {
		if (!id) return;
		const date = new Date();
		let string = date.toString();
		string = string.substring(0, 24);
		data.created_at = string;
		if (post) {
			data.post = post;
		}
		if (user) {
			data.creator = user;
		}

		const response = await api.db.forum.commentaires.createComment(data);

		if (response) {
			const data = await api.db.forum.getById({ id });
			setPost(data);
			setComments(data.comments);
		}
	};

	return (
		<div>
			<CenteredContainer
				horizontally
				textAlign="center"
				style={{ paddingLeft: '100px', paddingRight: '100px' }}
			>
				{post && (
					<div>
						<CardContainer asRow title="Question : ">
							<Card style={{ width: '70rem' }}>
								<Card.Title>{post.title}</Card.Title>
								<div className="text-left">{post.content}</div>
								<div className="text-right">{post.creator.email}</div>
							</Card>
						</CardContainer>
						<Row>
							<Col className="col-10">
								<CardContainer asRow title="Commentaires : ">
									{comments &&
										comments.map(comment => {
											return (
												<Card
													style={{ width: '60rem' }}
													className="text-left mt-5"
												>
													<Card.Header>{comment.creator.email}</Card.Header>
													<Card.Body>
														<Card.Text>{comment.content}</Card.Text>
													</Card.Body>
												</Card>
											);
										})}
									<Card style={{ width: '60rem' }} className="mt-5">
										<Card.Header>
											<Card.Text>Écrivez ici :</Card.Text>
										</Card.Header>
										<Card.Body>
											<Form onSubmit={handleSubmit(onSubmit)}>
												<Form.Group className="mb-3 text-left">
													<Form.Control
														as="textarea"
														id="formComment"
														rows={5}
														{...register('content')}
													/>
												</Form.Group>
												<Form.Group className="text-right">
													<Button variant="primary" id="btn" type="submit">
														Envoyer
													</Button>
												</Form.Group>
											</Form>
										</Card.Body>
									</Card>
								</CardContainer>
							</Col>
						</Row>
					</div>
				)}
			</CenteredContainer>
		</div>
	);
};

export default ForumPost;