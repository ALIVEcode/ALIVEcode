import { useContext, useState, Fragment } from 'react';
import { NavbarProps } from './NavbarTypes';
import { UserContext } from '../../../state/contexts/UserContext';
import { Link } from 'react-router-dom';
import TestLogo from '../../../assets/images/TestLogo.png';
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
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { classNames } from '../../../Types/utils';

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
		<Disclosure
			as="nav"
			id="navbar"
			className="fixed top-0 px-2 laptop:px-4 bg-[color:var(--background-color)] w-full border-b border-[color:var(--bg-shade-four-color)] z-10"
		>
			{({ open }) => (
				<>
					<div className="flex flex-row items-center h-16 justify-between">
						<div className="h-full flex items-center gap-x-2 laptop:gap-x-0 laptop:hidden w-1/3 laptop:w-auto">
							<Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-[color:var(--fg-shade-four-color)] hover:text-[color:var(--foreground-color)] hover:bg-[color:var(--bg-shade-two-color)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[color:var(--logo-color)]">
								<FontAwesomeIcon
									className="cursor-pointer"
									icon={open ? faTimes : faBars}
								></FontAwesomeIcon>
							</Disclosure.Button>
						</div>
						<div className="flex h-full items-center justify-center w-1/3 laptop:w-auto">
							<Link
								to={routes.public.home.path}
								className="py-3 h-full no-underline whitespace-nowrap flex items-center"
							>
								<img
									src={TestLogo}
									alt=""
									className="inline-block align-top h-full"
								/>
								<label
									className={classNames(
										'hidden phone:inline font-bold text-xl tablet:text-2xl align-bottom cursor-pointer ml-4',
										theme === themes.dark && 'text-white',
										theme === themes.light && 'text-gray-700',
									)}
								>
									ALIVEcode
								</label>
							</Link>
							<div className="laptop:flex hidden ml-5">
								{links.map((l, idx) => (
									<Link
										key={idx}
										className="h-full flex flex-col justify-center items-center mr-4 no-underline"
										to={l.path}
										onMouseEnter={() => setHovering(idx)}
										onMouseLeave={() => setHovering(undefined)}
									>
										<label
											className={classNames(
												l.active
													? 'text-[color:var(--logo-color)]'
													: 'text-[color:rgba(var(--foreground-color-rgb),0.6)]',
												'mt-2 text-sm cursor-pointer p-2 ',
											)}
										>
											{l.name}
										</label>
										<div
											className={
												'h-1 border-b-2 transition-all ' +
												(l.active
													? 'border-[color:var(--logo-color)] w-full '
													: 'hover:border-gray-100 w-4 ' +
													  (hovering === idx
															? 'border-gray-300'
															: 'border-transparent'))
											}
										></div>
									</Link>
								))}
							</div>
						</div>
						<div className="h-full flex justify-end items-center py-2 w-1/3 laptop:w-auto">
							<div className="hidden laptop:block text-right">
								{user ? (
									<label className="text-[color:rgba(var(--foreground-color-rgb),0.6)]">
										{t('home.navbar.msg.auth', { name: user.getDisplayName() })}
									</label>
								) : (
									<label className="text-xs laptop:text-sm text-[color:rgba(var(--foreground-color-rgb),0.6)]">
										{t('home.navbar.msg.non_auth.label')}
										<Link to={'/signin'} className="text-blue-500 underline">
											{t('home.navbar.msg.non_auth.link')}
										</Link>
									</label>
								)}
							</div>
							<Menu
								as="div"
								className="ml-4 relative inline-block text-left h-full"
							>
								<div className="h-full">
									<Menu.Button className="h-full w-10">
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
									<Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-[color:var(--background-color)] ring-1 ring-[color:var(--bg-shade-three-color)] ring-opacity-5 divide-y divide-[color:var(--bg-shade-three-color)] focus:outline-none">
										<div className="py-1">
											{user ? (
												<Menu.Item>
													{({ active }) => (
														<Link
															to={routes.auth.account.path}
															className={classNames(
																active &&
																	'bg-[color:var(--bg-shade-two-color)]',
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
																	active &&
																		'bg-[color:var(--bg-shade-two-color)]',
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
																	active &&
																		'bg-[color:var(--bg-shade-two-color)]',
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
																theme.name === 'dark'
																	? themes.light
																	: themes.dark,
															)
														}
														className={classNames(
															active && 'bg-[color:var(--bg-shade-two-color)]',
															'cursor-pointer block px-4 py-2 text-sm text-[color:var(--foreground-color)] hover:text-[color:var(--foreground-color)]',
														)}
													>
														Theme {theme.name === 'dark' ? 'light' : 'dark'}
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
																active &&
																	'bg-[color:var(--bg-shade-two-color)]',
																'block cursor-pointer px-4 py-2 text-sm text-[color:var(--foreground-color)] hover:text-[color:var(--foreground-color)]',
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
								className="ml-2 relative inline-block text-left h-full w-10"
							>
								<div className="h-full">
									<Menu.Button className="h-full w-10">
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
									<Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-[color:var(--background-color)] ring-1 ring-[color:var(--bg-shade-three-color)] ring-opacity-5 divide-y divide-[color:var(--bg-shade-three-color)] focus:outline-none">
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
					<Disclosure.Panel className="laptop:hidden border-t border-[color:var(--bg-shade-four-color)]">
						<div className="px-2 pt-2 pb-3 space-y-1">
							{links.map(l => (
								<Disclosure.Button
									key={l.name}
									as={Link}
									to={l.path}
									className={classNames(
										l.active
											? 'text-[color:var(--logo-color)] bg-[color:var(--bg-shade-one-color)]'
											: 'text-[color:rgba(var(--foreground-color-rgb),0.6)] hover:bg-[color:var(--bg-shade-two-color)]',
										'block px-3 py-2 rounded-md text-base font-medium no-underline',
									)}
									aria-current={l.active ? 'page' : undefined}
								>
									{l.name}
								</Disclosure.Button>
							))}
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
};

export default ALIVENavbar;
