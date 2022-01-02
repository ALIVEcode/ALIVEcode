import { plainToClass } from "class-transformer";
import { useEffect, useState } from "react";
import CardContainer from '../../../Components/UtilsComponents/CardContainer/CardContainer';
import api from '../../../Models/api';
import { CategorySubject } from '../../../Models/Forum/categorySubject.entity';
import { Subject } from '../../../Models/Forum/subjects.entity';
import ForumNavbar from '../ForumNavbar/ForumNavbar';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import useRoutes from '../../../state/hooks/useRoutes';

const ForumSubjectList = () => {
	const [category, setCategory] = useState<CategorySubject>();
	const [subject, setSubject] = useState<Subject[]>([]);
	const { id } = useParams<{ id: string }>();
	const { routes } = useRoutes();

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
			<div>
				<ForumNavbar />
			</div>
			<CardContainer
				className="p-5"
				asRow
				title={'Liste des sujets de : ' + category?.name}
			>
				<div>
					{subject.map((s, idx) => (
						<div key={idx}>
							<div>
								<div>
									<div>
										<div className="text-xl">{s.name}</div>
									</div>
									<div className="flex flex-col gap-2">
										{s.posts.map((p, idx) => (
											<div className="border-1 rounded-sm" key={idx}>
												<Link
													to={routes.public.forum_post.path.replace(
														':id',
														p.id,
													)}
												>
													<div className="bg-gray-100 border-b-2 text-xl p-2 py-1">
														{p.title}
													</div>
												</Link>
												<div className="bg-white p-2 rounded-md">
													{p.created_at} {p.creator.email}
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</CardContainer>
		</div>
	);
};

export default ForumSubjectList;
