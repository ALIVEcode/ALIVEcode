import { useState } from 'react';
import useRoutes from '../../../state/hooks/useRoutes';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../../Components/UtilsComponents/Button/Button';

const ForumNavbar = () => {
	const navigate = useNavigate();
	const [searchBar, setSearchBar] = useState('search');
	const { routes, goTo } = useRoutes();

	const handleChangeSearch = (event: any) => {
		setSearchBar(event.target.value);
	};

	return (
		<nav className="flex flex-row justify-between bg-[color:var(--background-color)] p-2">
			<div className="flex flex-row items-center">
				<div
					className="text-3xl"
					onClick={() => goTo(routes.public.forum.path)}
				>
					Socialive
				</div>
				<div className="flex flex-row gap-6 ml-5">
					<Link
						className="no-underline text-[color:var(--logo-color)]"
						to={routes.public.forum.path}
					>
						Home
					</Link>
					<Link
						className="no-underline text-[color:var(--logo-color)]"
						to={routes.public.forum_categories.path}
					>
						Catégories
					</Link>
				</div>
			</div>
			<form className="d-flex">
				<input className="input" type="search" onChange={handleChangeSearch} />
				<Button
					variant="primary"
					onClick={() =>
						navigate({
							pathname: routes.public.forum_search.path,
							search: `?q=${searchBar}`,
						})
					}
				>
					Recherche
				</Button>
			</form>
		</nav>
	);
};

export default ForumNavbar;
