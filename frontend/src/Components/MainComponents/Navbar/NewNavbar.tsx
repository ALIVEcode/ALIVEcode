import { NavbarProps } from './NavbarTypes';
import { Fragment, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../../assets/images/LogoALIVE.png';
import useRoutes from '../../../state/hooks/useRoutes';
import { useTranslation } from 'react-i18next';
import { ThemeContext, themes } from '../../../state/contexts/ThemeContext';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { UserContext } from '../../../state/contexts/UserContext';
import { languages } from '../../../appConfigs';
import i18next from 'i18next';

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

const NewNavbar = ({ handleLogout }: NavbarProps) => {
	const { routes } = useRoutes();
	const { t } = useTranslation();
	const { theme, setTheme } = useContext(ThemeContext);
	const { user } = useContext(UserContext);
	const navigate = useNavigate();

	const navigation = [
		{
			name: t('home.navbar.section.dashboard'),
			to: routes.auth.dashboard.path,
			current: false,
		},
		{
			name: t('home.navbar.section.ai'),
			to: routes.public.ai.path,
			current: false,
		},
		{
			name: t('home.navbar.section.iot'),
			to: routes.public.iot.path,
			current: false,
		},
		{
			name: t('home.navbar.section.about'),
			to: routes.public.about.path,
			current: false,
		},
	];

	return (
		<nav
			className="flex items-center justify-between flex-wrap bg-white p-3 relative z-10"
			style={{ color: theme.color.foreground }}
		>
			<Link
				to={routes.public.home.path}
				className="flex items-center flex-shrink-0 text-white mr-6 no-underline"
				style={{
					backgroundColor: theme.color.background,
				}}
			>
				<img
					src={Logo}
					alt=""
					width="100"
					height="30"
					className="d-inline-block align-top"
				></img>
				<span
					className="text-3xl font-bold tracking-wide ml-1 no-underline"
					style={{ color: theme.color.primary }}
				>
					code
				</span>
			</Link>
			<div className="block lg:hidden">
				<button className="flex items-center px-3 py-2 border rounded text-blue-200 border-blue-500 hover:text-white hover:border-white">
					<svg
						className="fill-current h-3 w-3"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>Menu</title>
						<path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
					</svg>
				</button>
			</div>
			<div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
				<div className="text-sm lg:text-base lg:flex-grow">
					{navigation.map(nav => (
						<Link
							key={nav.name}
							className="block lg:inline-block lg:mt-0 no-underline mr-5"
							to={nav.to}
							style={{ color: theme.color.foreground }}
						>
							{nav.name}
						</Link>
					))}
				</div>
				<div>
					{user ? (
						<label>
							{t('home.navbar.msg.auth', { name: user.getDisplayName() })}
						</label>
					) : (
						<label>
							{t('home.navbar.msg.non_auth.label')}
							<Link to={'/signin'}>{t('home.navbar.msg.non_auth.link')}</Link>
						</label>
					)}
					<DropdownButton
						align="end"
						className="inline"
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
					>
						{user ? (
							<>
								<Dropdown.Item
									onClick={() => navigate(routes.auth.account.path)}
								>
									{t('msg.section.account')}
								</Dropdown.Item>
								<Dropdown.Item
									onClick={() => {
										setTheme(
											theme.name === 'dark' ? themes.light : themes.dark,
										);
									}}
								>
									Theme
								</Dropdown.Item>
								<Dropdown.Divider />
								<Dropdown.Item onClick={handleLogout}>
									{t('msg.auth.signout')}
								</Dropdown.Item>
							</>
						) : (
							<>
								<Dropdown.Item
									onClick={() => navigate(routes.non_auth.signin.path)}
								>
									{t('msg.auth.signin')}
								</Dropdown.Item>
								<Dropdown.Item
									onClick={() => navigate(routes.non_auth.signup.path)}
								>
									{t('msg.auth.signup')}
								</Dropdown.Item>
								<Dropdown.Item
									onClick={() => {
										setTheme(
											theme.name === 'dark' ? themes.light : themes.dark,
										);
									}}
								>
									Theme
								</Dropdown.Item>
							</>
						)}
					</DropdownButton>
					<DropdownButton
						align="end"
						className="inline"
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
						as="div"
					>
						{languages.map(({ code, name }, idx) => (
							<Dropdown.Item
								key={idx}
								onClick={() => i18next.changeLanguage(code)}
								disabled={i18next.language === code}
							>
								{name}
							</Dropdown.Item>
						))}
					</DropdownButton>
				</div>
			</div>
		</nav>
	);
};

export default NewNavbar;