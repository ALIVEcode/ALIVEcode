import { useState } from "react";
import { Button, Form, Nav, Navbar } from 'react-bootstrap';
import useRoutes from '../../../state/hooks/useRoutes';
import { useNavigate } from 'react-router-dom';

const ForumNavbar = () => {
	const navigate = useNavigate();
	const [searchBar, setSearchBar] = useState('search');
	const { routes, goTo } = useRoutes();

	const handleChangeSearch = (event: any) => {
		setSearchBar(event.target.value);
	};

	return (
		<Navbar bg="light">
			<Navbar.Brand onClick={() => goTo(routes.public.forum.path)}>
				Socialive
			</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="me-auto">
					<Nav.Link onClick={() => goTo(routes.public.forum.path)}>
						Home
					</Nav.Link>
					<Nav.Link onClick={() => goTo(routes.public.forum_categories.path)}>
						Catégories
					</Nav.Link>
				</Nav>
			</Navbar.Collapse>
			<Form className="d-flex">
				<input className="input" type="search" onChange={handleChangeSearch} />
				<Button
					onClick={() =>
						navigate({
							pathname: routes.public.forum_search.path,
							search: `?q=${searchBar}`,
						})
					}
				>
					Recherche
				</Button>
			</Form>
		</Navbar>
	);
};

export default ForumNavbar;