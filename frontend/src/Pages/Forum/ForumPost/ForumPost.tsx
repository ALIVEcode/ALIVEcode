import { useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import CardContainer from '../../../Components/UtilsComponents/CardContainer/CardContainer';
import api from '../../../Models/api';
import { Comment } from '../../../Models/Forum/comment.entity';
import { Post } from '../../../Models/Forum/post.entity';
import { UserContext } from '../../../state/contexts/UserContext';
import { useParams } from 'react-router';
import Button from '../../../Components/UtilsComponents/Button/Button';

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
		<div className="p-10">
			{post && (
				<div>
					<CardContainer asRow title="Question : ">
						<div style={{ width: '70rem' }}>
							<div>{post.title}</div>
							<div className="text-left">{post.content}</div>
							<div className="text-right">{post.creator.email}</div>
						</div>
					</CardContainer>
					<CardContainer className="p-10" asRow title="Commentaires : ">
						{comments &&
							comments.map(comment => {
								return (
									<div className="w-4/5 text-left mt-5 border-1 rounded-md">
										<div className="bg-gray-100 p-3 border-b-2">
											{comment.creator.email}
										</div>
										<div className="bg-white p-3 rounded-md">
											<label>{comment.content}</label>
										</div>
									</div>
								);
							})}
						<div className="w-full mt-5">
							<div>
								<label>Écrivez ici :</label>
							</div>
							<div>
								<form onSubmit={handleSubmit(onSubmit)}>
									<div className="mb-3 text-left">
										<textarea
											className="w-full border-1 rounded-md"
											id="formComment"
											rows={5}
											{...register('content', { required: true })}
										/>
									</div>
									<div className="text-right">
										<Button variant="third" type="submit">
											Envoyer
										</Button>
									</div>
								</form>
							</div>
						</div>
					</CardContainer>
				</div>
			)}
		</div>
	);
};

export default ForumPost;
