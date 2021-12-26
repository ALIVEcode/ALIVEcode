import { Button, Form, FormControl, Nav, Navbar } from "react-bootstrap";

const NavBarSocial = () => {
    return (
        <Navbar bg="light">
				<Navbar.Brand href="#home">Socialive</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="me-auto">
					<Nav.Link href="#home">Home</Nav.Link>
					<Nav.Link href="#link">Forum</Nav.Link>
					<Nav.Link href="#link">Message</Nav.Link>
				</Nav>
				</Navbar.Collapse>
				<Form className="d-flex">
					<FormControl
					type="search"
					placeholder="Search"
					className="me-2 mr-2"
					aria-label="Search"
					/>
					<Button variant={'primary'}>Recherche</Button>
				</Form>
			</Navbar>
    );
};

export default NavBarSocial;