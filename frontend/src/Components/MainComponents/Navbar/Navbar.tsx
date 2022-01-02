import { useContext, useState, Fragment } from 'react';
import { NavbarProps, StyledNavbar } from './NavbarTypes';
import { UserContext } from '../../../state/contexts/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import Logo from '../../../assets/images/LogoALIVE.png';
import i18next from 'i18next';
import { languages } from '../../../appConfigs';
import { useTranslation } from 'react-i18next';
import useRoutes from '../../../state/hooks/useRoutes';
import {
	commonColors,
	ThemeContext,
	themes,
} from '../../../state/contexts/ThemeContext';
import { useLocation } from 'react-router';
import { Menu, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

function classNames(...classes: any[]) {
	return classes.filter(Boolean).join(' ');
}

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
	const navigate = useNavigate();
	const location = useLocation();
	const [hovering, setHovering] = useState<number>();

	const links = [
		{
			path: routes.auth.dashboard.path,
			name: t('home.navbar.section.dashboard'),
			active: location.pathname.startsWith('/dashboard'),
		},
		{
			path: routes.public.ai.path,
			name: t('home.navbar.section.ai'),
			active: location.pathname.startsWith('/ai'),
		},
		{
			path: routes.public.iot.path,
			name: t('home.navbar.section.iot'),
			active: location.pathname.startsWith('/iot'),
		},
		{
			path: routes.public.about.path,
			name: t('home.navbar.section.about'),
			active: location.pathname.startsWith('/about'),
		},
	];

	return (
		<div className="fixed top-0 px-4 bg-[color:var(--background-color)] w-full border-b border-[color:var(--bg-shade-four-color)]">
			<div className="flex flex-row items-center h-16 justify-between">
				<div className="flex h-full items-center">
					<Link to={routes.public.home.path} className="py-2 mr-5">
						<img
							src={Logo}
							alt=""
							width="100"
							height="30"
							className="d-inline-block align-top"
						/>
						<label className="h-full font-bold text-2xl align-bottom cursor-pointer ml-1 text-[color:var(--logo-color)]">
							code
						</label>
					</Link>
					{links.map((l, idx) => (
						<Link
							key={idx}
							className="h-full flex flex-col justify-center items-center mr-4 no-underline"
							to={l.path}
							onMouseEnter={() => setHovering(idx)}
							onMouseLeave={() => setHovering(undefined)}
						>
							<label
								className={
									'mt-2 text-sm cursor-pointer p-2 ' +
									(!l.active
										? 'text-[color:rgba(var(--foreground-color-rgb),0.6)]'
										: '')
								}
							>
								{l.name}
							</label>
							<div
								className={
									'h-1 border-b-2 transition-all ' +
									(l.active
										? 'border-blue-500 w-full '
										: 'hover:border-gray-100 w-4 ' +
										  (hovering === idx
												? 'border-gray-300'
												: 'border-transparent'))
								}
							></div>
						</Link>
					))}
				</div>
				<div className="h-full flex items-center py-2">
					{user ? (
						<label className="text-sm text-[color:rgba(var(--foreground-color-rgb),0.6)]">
							{t('home.navbar.msg.auth', { name: user.getDisplayName() })}
						</label>
					) : (
						<label className="text-sm text-[color:rgba(var(--foreground-color-rgb),0.6)]">
							{t('home.navbar.msg.non_auth.label')}
							<Link to={'/signin'} className="text-blue-500 underline">
								{t('home.navbar.msg.non_auth.link')}
							</Link>
						</label>
					)}
					<Menu
						as="div"
						className="ml-5 relative inline-block text-left h-full"
					>
						<div className="h-full">
							<Menu.Button className="h-full">
								<svg
									className="w-full h-full"
									version="1.1"
									xmlns="http://www.w3.org/2000/svg"
									xmlnsXlink="http://www.w3.org/1999/xlink"
									viewBox="0 0 600 600"
									stroke={commonColors.logo}
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
							</Menu.Button>
						</div>

						<Transition
							as={Fragment}
							enter="transition ease-out duration-100"
							enterFrom="transform opacity-0 scale-95"
							enterTo="transform opacity-100 scale-100"
							leave="transition ease-in duration-75"
							leaveFrom="transform opacity-100 scale-100"
							leaveTo="transform opacity-0 scale-95"
						>
							<Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-[color:var(--background-color)] ring-1 ring-[color:var(--foreground-color)] ring-opacity-5 divide-y divide-[color:var(--bg-shade-three-color)] focus:outline-none">
								<div className="py-1">
									{user ? (
										<Menu.Item>
											{({ active }) => (
												<Link
													to={routes.auth.account.path}
													className={classNames(
														active && 'bg-[color:var(--bg-shade-two-color)]',
														'block px-4 py-2 text-sm text-[color:var(--foreground-color)] hover:text-[color:var(--foreground-color)]',
													)}
												>
													{t('msg.section.account')}
												</Link>
											)}
										</Menu.Item>
									) : (
										<>
											<Menu.Item>
												{({ active }) => (
													<Link
														to={routes.non_auth.signin.path}
														className={classNames(
															active && 'bg-[color:var(--bg-shade-two-color)]',
															'block px-4 py-2 text-sm text-[color:var(--foreground-color)] hover:text-[color:var(--foreground-color)]',
														)}
													>
														{t('msg.auth.signin')}
													</Link>
												)}
											</Menu.Item>

											<Menu.Item>
												{({ active }) => (
													<Link
														to={routes.non_auth.signup.path}
														className={classNames(
															active && 'bg-[color:var(--bg-shade-two-color)]',
															'block px-4 py-2 text-sm text-[color:var(--foreground-color)] hover:text-[color:var(--foreground-color)]',
														)}
													>
														{t('msg.auth.signup')}
													</Link>
												)}
											</Menu.Item>
										</>
									)}
									<Menu.Item>
										{({ active }) => (
											<div
												onClick={() =>
													setTheme(
														theme.name === 'dark' ? themes.light : themes.dark,
													)
												}
												className={classNames(
													active && 'bg-[color:var(--bg-shade-two-color)]',
													'block px-4 py-2 text-sm text-[color:var(--foreground-color)] hover:text-[color:var(--foreground-color)]',
												)}
											>
												Theme
											</div>
										)}
									</Menu.Item>
								</div>
								{user && (
									<div className="py-1">
										<Menu.Item>
											{({ active }) => (
												<div
													onClick={handleLogout}
													className={classNames(
														active && 'bg-[color:var(--bg-shade-two-color)]',
														'block px-4 py-2 text-sm text-[color:var(--foreground-color)] hover:text-[color:var(--foreground-color)]',
													)}
												>
													{t('msg.auth.signout')}
												</div>
											)}
										</Menu.Item>
									</div>
								)}
							</Menu.Items>
						</Transition>
					</Menu>
					<Menu
						as="div"
						className="ml-2 relative inline-block text-left h-full"
					>
						<div className="h-full">
							<Menu.Button className="h-full">
								<svg
									className="w-full h-full"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 16 16"
									fill={commonColors.logo}
									strokeWidth="0.01"
								>
									<title>Globe icon</title>
									<path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z" />
								</svg>
							</Menu.Button>
						</div>

						<Transition
							as={Fragment}
							enter="transition ease-out duration-100"
							enterFrom="transform opacity-0 scale-95"
							enterTo="transform opacity-100 scale-100"
							leave="transition ease-in duration-75"
							leaveFrom="transform opacity-100 scale-100"
							leaveTo="transform opacity-0 scale-95"
						>
							<Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-[color:var(--background-color)] ring-1 ring-[color:var(--foreground-color)] ring-opacity-5 divide-y divide-[color:var(--bg-shade-three-color)] focus:outline-none">
								<div className="py-1">
									{languages.map(({ code, name }, idx) => (
										<Menu.Item key={idx}>
											{({ active }) => (
												<div
													onClick={() =>
														i18next.language !== code &&
														i18next.changeLanguage(code)
													}
													className={classNames(
														active &&
															i18next.language !== code &&
															'bg-[color:var(--bg-shade-two-color)]',
														i18next.language === code
															? 'text-[color:var(--bg-shade-four-color)]'
															: 'text-[color:var(--foreground-color)] hover:text-[color:var(--foreground-color)] cursor-pointer',
														'block px-4 py-2 text-sm ',
													)}
												>
													{name}
												</div>
											)}
										</Menu.Item>
									))}
								</div>
							</Menu.Items>
						</Transition>
					</Menu>
				</div>
			</div>
		</div>
	);
};

export default ALIVENavbar;

/*

		<StyledNavbar id="navbar" expand="lg" theme={theme}>
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
						onClick={() => navigate(routes.auth.dashboard.path)}
					>
						{t('home.navbar.section.dashboard')}
					</Nav.Link>
					<Nav.Link
						className="nav-link"
						onClick={() => navigate(routes.public.ai.path)}
					>
						{t('home.navbar.section.ai')}
					</Nav.Link>
					<Nav.Link
						className="nav-link"
						onClick={() => navigate(routes.public.iot.path)}
					>
						{t('home.navbar.section.iot')}
					</Nav.Link>
					<Nav.Link
						className="nav-link"
						onClick={() => navigate(routes.public.amc.path)}
					>
						{t('home.navbar.section.amc')}
					</Nav.Link>
					<Nav.Link
						className="nav-link"
						onClick={() => navigate(routes.public.about.path)}
					>
						{t('home.navbar.section.about')}
					</Nav.Link>
				</Nav>
				<div className="d-flex flex-row order-2 order-lg-3">
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
					<ul className="navbar-nav flex-row">
						<li className="nav-item">
							<div id="user" className="dropdown">
								<NavDropdown
									align="end"
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
												onClick={() => navigate(routes.auth.account.path)}
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
												onClick={() => navigate(routes.non_auth.signin.path)}
											>
												{t('msg.auth.signin')}
											</NavDropdown.Item>
											<NavDropdown.Item
												onClick={() => navigate(routes.non_auth.signup.path)}
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
									align="end"
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
		</StyledNavbar>


*/
