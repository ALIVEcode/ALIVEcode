import { useContext } from 'react';
import { NavbarProps } from './NavbarTypes';
import { UserContext } from '../../../state/contexts/UserContext';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

import './navbar.css';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import Logo from '../../../assets/images/LogoALIVE.png';
import i18next from 'i18next';
import { languages } from '../../../appConfigs';
import { useTranslation } from 'react-i18next';
import useRoutes from '../../../state/hooks/useRoutes';
import { ThemeContext, themes } from '../../../state/contexts/ThemeContext';

/**
 * Navbar of ALIVEcode
 *
 * @param {() => void} handleLogout callback that logs out the user and change the global state of the app
 *
 * @author MoSk3
 */
const ALIVENavbar = ({ handleLogout }: NavbarProps) => {
	const { user } = useContext(UserContext);
	const { t } = useTranslation();
	const { routes } = useRoutes();
	const { theme, setTheme } = useContext(ThemeContext);

	const history = useHistory();

	return (
		<Navbar id="navbar" expand="lg">
			<Navbar.Brand>
				<Link to={routes.public.home.path}>
					<img
						src={Logo}
						alt=""
						width="100"
						height="30"
						className="d-inline-block align-top"
					></img>
				</Link>
			</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="mr-auto">
					<Nav.Link
						className="nav-link"
						onClick={() => history.push(routes.auth.dashboard.path)}
					>
						{t('home.navbar.section.dashboard')}
					</Nav.Link>
					<Nav.Link
						className="nav-link"
						onClick={() => history.push(routes.public.ai.path)}
					>
						{t('home.navbar.section.ai')}
					</Nav.Link>
					<Nav.Link
						className="nav-link"
						onClick={() => history.push(routes.public.iot.path)}
					>
						{t('home.navbar.section.iot')}
					</Nav.Link>
					<Nav.Link
						className="nav-link"
						onClick={() => history.push(routes.public.amc.path)}
					>
						{t('home.navbar.section.amc')}
					</Nav.Link>
					<Nav.Link
						className="nav-link"
						onClick={() => history.push(routes.public.about.path)}
					>
						{t('home.navbar.section.about')}
					</Nav.Link>
				</Nav>
				{user ? (
					<label style={{ marginBottom: '0' }} className="nav-link">
						{t('home.navbar.msg.auth', { name: user.getDisplayName() })}
					</label>
				) : (
					<label className="nav-link">
						{t('home.navbar.msg.non_auth.label')}
						<Link to={'/signin'}>{t('home.navbar.msg.non_auth.link')}</Link>
					</label>
				)}
				<div className="d-flex flex-row order-2 order-lg-3">
					<ul className="navbar-nav flex-row">
						<li className="nav-item">
							<div id="user" className="dropdown">
								<NavDropdown
									alignRight
									title={
										<svg
											version="1.1"
											xmlns="http://www.w3.org/2000/svg"
											xmlnsXlink="http://www.w3.org/1999/xlink"
											viewBox="0 0 600 600"
											stroke="#0178bc"
											strokeWidth="30"
											fill="none"
										>
											<title>Abstract user icon</title>

											<circle cx="300" cy="300" r="265" />
											<circle cx="300" cy="230" r="115" />
											<path
												d="M106.81863443903,481.4 a205,205 1 0,1 386.36273112194,0"
												strokeLinecap="butt"
											/>
										</svg>
									}
									id="basic-nav-dropdown"
								>
									{user ? (
										<>
											<NavDropdown.Item
												onClick={() => history.push(routes.auth.account.path)}
											>
												{t('msg.section.account')}
											</NavDropdown.Item>
											<NavDropdown.Item
												onClick={() => {
													setTheme(
														theme.name === 'dark' ? themes.light : themes.dark,
													);
												}}
											>
												Theme
											</NavDropdown.Item>
											<NavDropdown.Divider />
											<NavDropdown.Item onClick={handleLogout}>
												{t('msg.auth.signout')}
											</NavDropdown.Item>
										</>
									) : (
										<>
											<NavDropdown.Item
												onClick={() =>
													history.push(routes.non_auth.signin.path)
												}
											>
												{t('msg.auth.signin')}
											</NavDropdown.Item>
											<NavDropdown.Item
												onClick={() =>
													history.push(routes.non_auth.signup.path)
												}
											>
												{t('msg.auth.signup')}
											</NavDropdown.Item>
											<NavDropdown.Item
												onClick={() => {
													setTheme(
														theme.name === 'dark' ? themes.light : themes.dark,
													);
												}}
											>
												Theme
											</NavDropdown.Item>
										</>
									)}
								</NavDropdown>
							</div>
						</li>
						<li className="nav-item">
							<div id="user" className="dropdown">
								<NavDropdown
									alignRight
									title={
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="bi bi-globe"
											viewBox="0 0 16 16"
											fill="#0178bc"
											strokeWidth="0.01"
										>
											<path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z" />
										</svg>
									}
									id="basic-nav-dropdown"
								>
									{languages.map(({ code, name }, idx) => (
										<NavDropdown.Item
											key={idx}
											onClick={() => i18next.changeLanguage(code)}
											disabled={i18next.language === code}
										>
											{name}
										</NavDropdown.Item>
									))}
								</NavDropdown>
							</div>
						</li>
					</ul>
					<button
						className="navbar-toggler"
						type="button"
						data-toggle="collapse"
						data-target="#navbarNavDropdown"
					>
						<span className="navbar-toggler-icon"></span>
					</button>
				</div>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default ALIVENavbar;