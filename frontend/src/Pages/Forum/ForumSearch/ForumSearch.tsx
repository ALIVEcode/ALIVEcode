import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CardContainer from '../../../Components/UtilsComponents/CardContainer/CardContainer';
import CenteredContainer from '../../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import api from '../../../Models/api';
import { Post } from '../../../Models/Forum/post.entity';
import ForumNavbar from '../ForumNavbar/ForumNavbar';

const ForumSearch = () => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [searchParams] = useSearchParams();
	const query = searchParams.get('q');

	useEffect(() => {
		const getPosts = async () => {
			const data = await api.db.forum.getPost({});
			if (!query) return setPosts(data);
			setPosts(
				data.filter(post =>
					post.title.toLowerCase().includes(query.toLowerCase()),
				),
			);
		};
		getPosts();
	}, [query]);

	return (
		<>
			<CenteredContainer
				horizontally
				textAlign="center"
				style={{ paddingLeft: '100px', paddingRight: '100px' }}
			>
				<ForumNavbar />
				<CardContainer asRow title={'Recherche : '}>
					{posts.map((post, idx) => {
						return (
							<div style={{ width: '20rem' }} className="mt-3 ml-2" key={idx}>
								<Link to={'/forum/post/' + post.id}>
									<div className="text-2xl">{post.title}</div>
								</Link>
								<p className="text-sm">
									{post.created_at + ' ' + post.creator.email}
								</p>
							</div>
						);
					})}
				</CardContainer>
			</CenteredContainer>
		</>
	);
};

export default ForumSearch;
