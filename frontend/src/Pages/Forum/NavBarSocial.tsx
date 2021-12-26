import { SetStateAction, useState } from "react";
import { Button, Form, Nav, Navbar } from "react-bootstrap";
import { useHistory } from "react-router";

const NavBarSocial = () => {
	const [searchBar, setSearchBar] = useState('search');

	function handleChangeSearch(event: any) {
		setSearchBar(event.target.value);
	  }


    return (
        <Navbar bg="light">
				<Navbar.Brand href="/forum">Socialive</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="me-auto">
					<Nav.Link href="/forum">Home</Nav.Link>
					<Nav.Link href="/forum/categoriesForum">Catégories</Nav.Link>
				</Nav>
				</Navbar.Collapse>
				<Form className="d-flex">
				<input className="input" type="search" onChange={handleChangeSearch}/>
				<Button href={'/forum/searchForum/'+ searchBar}>Recherche</Button>
			</Form>
				
			</Navbar>
    );
};

export default NavBarSocial;