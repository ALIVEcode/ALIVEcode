import Button from '../../../Components/UtilsComponents/Buttons/Button';
import CardContainer from '../../../Components/UtilsComponents/CardContainer/CardContainer';
import ForumNavbar from '../ForumNavbar/ForumNavbar';
import { Post as PostModel } from '../../../Models/Forum/post.entity';
import { useEffect, useState } from 'react';
import api from '../../../Models/api';
import { plainToClass } from 'class-transformer';
import { Link } from 'react-router-dom';
import useRoutes from '../../../state/hooks/useRoutes';

const ForumHome = () => {
	const [post, setPost] = useState<PostModel[]>([]);
	const { routes } = useRoutes();

	useEffect(() => {
		const getPost = async () => {
			const data = await api.db.forum.getLastPost({});
			setPost(data.map((d: any) => plainToClass(PostModel, d)));
		};
		getPost();
	}, []);

	return (
		<div>
			<div>
				<ForumNavbar />
			</div>

			<div className="flex flex-row gap-10">
				<div className="w-2/3">
					<CardContainer asRow title="Forum">
						<div className="text-left ml-3" style={{ height: '22rem' }}>
							Règles
							<br />
							- Lorem Ipsum is simply dummy text of the printing and typesetting
							industry. Lorem Ipsum has been the industry's standard dummy text
							ever since the 1500s.
							<br />
							- Lorem Ipsum is simply dummy text of the printing and typesetting
							industry. Lorem Ipsum has been the industry's standard dummy text
							ever since the 1500s.
							<br />- Lorem Ipsum is simply dummy text of the printing and
							typesetting industry. Lorem Ipsum has been the industry's standard
							dummy text ever since the 1500s.
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
				</div>

				<div className="h-1/3">
					<div className="flex justify-center">
						<Link className="mt-5" to={routes.auth.forum_post_form.path}>
							<Button variant={'primary'} className="btn-lg">
								Créer un sujet
							</Button>
						</Link>
					</div>
					<CardContainer asRow title="Derniers sujets">
						<div>
							{post.map((p, idx) => (
								<Link
									to={routes.public.forum_post.path.replace(':id', p.id)}
									key={idx}
								>
									<div className="ml-2 mr-2 mt-2" style={{ width: '22rem' }}>
										<div className="card-content">
											<div className="media">
												<img
													className="rounded-circle inline"
													src="https://bulma.io/images/placeholders/64x64.png"
													alt=""
												/>
												{p.creator && (
													<div className="ml-2 text-xl inline">
														{p.creator.email}
													</div>
												)}
											</div>
										</div>
										<div className="ml-2">
											{p.title}
											<br />
											<div>
												<small className="text-muted">{p.created_at}</small>
											</div>
										</div>
									</div>
								</Link>
							))}
						</div>
					</CardContainer>
				</div>
			</div>
		</div>
	);
};

export default ForumHome;
