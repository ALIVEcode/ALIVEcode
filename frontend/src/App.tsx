import './App.css';
import { RouterSwitch } from './Router/RouterSwitch/RouterSwitch';
import { useNavigate } from 'react-router-dom';
import { UserContext, UserContextValues } from './state/contexts/UserContext';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import useRoutes from './state/hooks/useRoutes';
import {
	ThemeContext,
	Theme,
	themes,
	commonColors,
} from './state/contexts/ThemeContext';
import { createGlobalStyle } from 'styled-components';
import { loadThemeFromCookies, setCookie } from './Types/cookies';
import { useAlert } from 'react-alert';
import { useTranslation } from 'react-i18next';
import { setAccessToken } from './Types/accessToken';
import { User, Student, Professor } from './Models/User/user.entity';
import LoadingScreen from './Components/UtilsComponents/LoadingScreen/LoadingScreen';
import background_image_light from './assets/images/backgroundImage4.png';
import background_image_dark from './assets/images/backgroundImageDark4.png';
import api from './Models/api';
import MaintenanceBar from './Components/SiteStatusComponents/MaintenanceBar/MaintenanceBar';
import { Maintenance } from './Models/Maintenance/maintenance.entity';
import openPlaySocket from './Pages/Challenge/PlaySocket';
import { PlaySocket } from './Pages/Challenge/PlaySocket';
import Navbar from './Components/MainComponents/Navbar/Navbar';
import { useLocation } from 'react-router';
import { hot } from 'react-hot-loader/root';
import Modal from './Components/UtilsComponents/Modal/Modal';
import NameMigrationForm from './Components/SiteStatusComponents/NameMigrationForm/NameMigrationForm';
import { useForceUpdate } from './state/hooks/useForceUpdate';
import { Resource } from './Models/Resource/resource.entity';
import FeedbackModal from './Components/MainComponents/FeedbackMenu/FeedbackModal';
import Confetti from 'react-confetti';
import useAudio from './state/hooks/useAudio';
import Tutorial from './Pages/Help/InfoTutorial';
import MenuResourceCreation from './Components/Resources/MenuResourceCreation/MenuResourceCreation';
import { ResourceMenuSubjects } from './Pages/ResourceMenu/resourceMenuTypes';
import { RESOURCE_TYPE } from '../../backend/src/models/resource/entities/resource.entity';
import { MenuResourceCreationDTO } from './Components/Resources/MenuResourceCreation/menuResourceCreationTypes';

type GlobalStyleProps = {
	theme: Theme;
};

const GlobalStyle = createGlobalStyle`

  body {
    background-color: var(--background-color);
    color: var(--foreground-color);
    ${({ theme }: GlobalStyleProps) => {
			return theme.name === 'light'
				? `background-image: url(${background_image_light});`
				: `background-image: url(${background_image_dark});`;
		}}
  }

  ${({ theme }: GlobalStyleProps) => {
		const cssVars = [];
		for (const [colorName, color] of Object.entries({
			...commonColors,
			...theme.color,
		})) {
			const cssName = colorName.endsWith('rgb')
				? `--${colorName.split('_').slice(0, -1).join('-')}-color-rgb`
				: `--${colorName.replaceAll('_', '-')}-color`;
			cssVars.push(`${cssName}: ${color}`);
		}

		cssVars.push(`--oxygen-font: 'Oxygen', sans-serif`);
		cssVars.push(`--title-font: 'Roboto', sans-serif`);
		cssVars.push(`--drop-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25)`);

		return ':root {' + cssVars.join(';') + '}';
		/*
		return `:root {
						--primary-color: ${theme.color.primary};
						--primary-color-rgb: ${theme.color.primary_rgb};
						--secondary-color: ${theme.color.secondary};
						--secondary-color-rgb: ${theme.color.secondary_rgb};
						--third-color: ${theme.color.third};
						--third-color-rgb: ${theme.color.third_rgb};
						--fourth-color: ${theme.color.fourth};
						--fourth-color-rgb: ${theme.color.fourth_rgb};
						--pale-color: ${theme.color.pale};
						--pale-color-rgb: ${theme.color.pale_rgb};
						--contrast-color: ${theme.color.contrast};
						--contrast-color-rgb: ${theme.color.contrast};
						--background-color: ${theme.color.background};
						--background-color-rgb: ${theme.color.background_rgb};
						--background-hover-color: ${theme.color.background_hover};
						--foreground-color: ${theme.color.foreground};
						--foreground-color-rgb: ${theme.color.foreground_rgb};
					}
				`;
				*/
	}}
`;

const App = () => {
	const [user, setUser] = useState<User | null>(null);
	const [playSocket, setPlaySocket] = useState<PlaySocket | null>(null);
	const [loading, setLoading] = useState(true);
	const [theme, setTheme] = useState(themes.light);
	const [maintenance, setMaintenance] = useState<Maintenance | null>(null);
	const [resources, setResources] = useState<Resource[] | null>(null);
	const [oldStudentNameMigrationOpen, setOldStudentNameMigrationOpen] =
		useState(true);
	const [resourceCreationMenuOpen, setResourceCreationMenuOpen] =
		useState(false);

	const { routes } = useRoutes();
	const { t } = useTranslation();
	const alert = useAlert();
	const { pathname } = useLocation();
	const forceUpdate = useForceUpdate();
	const navigate = useNavigate();

	const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

	const handleSetUser = useCallback(
		(user: User | null, doesForceUpdate?: boolean) => {
			setUser(user);
			doesForceUpdate && forceUpdate();
		},
		[forceUpdate],
	);

	/**
	 * Function that get the resources of the user based on the query
	 */
	const getResources = useCallback(
		async (
			subject: ResourceMenuSubjects,
			name?: string | undefined,
			filters?: RESOURCE_TYPE[],
		) => {
			if (!user)
				throw new Error('User is not loaded when trying to get the resources');
			const loadedRes = await api.db.users.getResources(user.id, {
				subject: subject !== 'all' ? subject : undefined,
				types: filters && filters.length > 0 ? filters : undefined,
				name,
			});
			setResources(loadedRes);
			return loadedRes;
		},
		[user],
	);

	const createResource = useCallback(
		async (
			dto: MenuResourceCreationDTO,
			progressSetter?: React.Dispatch<React.SetStateAction<number>>,
		) => {
			const res = resources ?? (await getResources('all'));
			const resource = await api.db.resources.create(dto, progressSetter);
			setResources([...res, resource]);
			return resource;
		},
		[getResources, resources],
	);

	const deleteResource = useCallback(
		async (resource: Resource) => {
			const res = resources ?? (await getResources('all'));
			await api.db.resources.delete({ id: resource.id });
			setResources(res?.filter(r => r.id !== resource.id));
		},
		[getResources, resources],
	);

	const updateResource = useCallback(
		async function <T>(
			defaultResource: Resource,
			newResource: Omit<T, keyof Resource> | MenuResourceCreationDTO,
		) {
			const res = resources ?? (await getResources('all'));
			const updatedRes = await api.db.resources.update(
				defaultResource,
				newResource,
			);

			const matchingRes = res.find(r => r.id === updatedRes.id);
			if (!matchingRes) return updatedRes;
			Object.assign(matchingRes, updatedRes);

			setResources([...res]);

			return matchingRes;
		},
		[getResources, resources],
	);

	const userProviderValue: UserContextValues = useMemo(
		() => ({
			user,
			setUser: handleSetUser,
			maintenance,
			playSocket,
			resources: resources ?? [],
			createResource,
			deleteResource,
			updateResource,
			setResourceCreationMenuOpen,
			getResources,
		}),
		[
			user,
			handleSetUser,
			maintenance,
			playSocket,
			resources,
			createResource,
			deleteResource,
			updateResource,
			setResourceCreationMenuOpen,
			getResources,
		],
	);

	const handleSetTheme = (theme: Theme) => {
		setCookie('theme', theme.name, 365);
		setTheme(theme);
	};

	const logout = useCallback(async () => {
		try {
			await axios.get('users/logout');
			setAccessToken('');
			setUser(null);
		} catch {
			alert.error(t('error.logout'));
		}
	}, [alert, t]);

	useEffect(() => {
		// Persist login
		const getUser = async () => {
			try {
				const { accessToken } = (await axios.post('/users/refreshToken')).data;
				if (!accessToken) throw new Error('Could not login');
				setAccessToken(accessToken);

				const loadedUser = await User.loadUser();
				setLoading(false);
				if (!loadedUser) {
					const loadedTheme = loadThemeFromCookies();
					if (loadedTheme && loadedTheme !== theme) setTheme(loadedTheme);
					return navigate(routes.non_auth.signin.path);
				}
				const loadedTheme = loadThemeFromCookies();
				if (loadedTheme && loadedTheme !== theme) setTheme(loadedTheme);
				setUser(loadedUser);
				await api.db.maintenances.getUpcoming();
			} catch {
				const loadedTheme = loadThemeFromCookies();
				if (loadedTheme && loadedTheme !== theme) setTheme(loadedTheme);
				return setLoading(false);
			}
		};
		getUser();

		// Automatically refresh access token
		axios.interceptors.response.use(
			response => response,
			async error => {
				const originalRequest = error.config;
				if (process.env.DEBUG && error.response) console.log(error.response);
				if (
					error.response &&
					error.response.status === 401 &&
					originalRequest.url === process.env.BACKEND_URL + 'users/refreshToken'
				) {
					if (user) await logout();
					return Promise.reject(error);
				}
				if (
					error.response &&
					error.response.data.message === 'Not Authenticated' &&
					error.response.status === 401
				) {
					try {
						const { accessToken } = (await axios.post('/users/refreshToken'))
							.data;
						if (!accessToken) return Promise.reject(error);
						setAccessToken(accessToken);
						originalRequest.headers.Authorization = 'JWT ' + accessToken;

						return axios(originalRequest);
					} catch (err) {
						if (process.env.DEBUG) console.error(err);
					}
				}
				if (
					error.response &&
					error.response.data.message === 'Server is in maintenance' &&
					error.response.status === 503
				) {
					//setMaintenance({ ...maintenance, hidden: false });
					alert.error(t('error.maintenance.short'));
				}
				return Promise.reject(error);
			},
		);

		const getUpcomingMaintenance = async () => {
			try {
				const maintenance = await api.db.maintenances.getUpcoming();
				setMaintenance(maintenance);
			} catch {}
		};
		getUpcomingMaintenance();

		const playSocket = openPlaySocket();
		setPlaySocket(playSocket);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Scroll restoration
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	useEffect(() => {
		const handleFeedbackModalOpen = (e: KeyboardEvent) => {
			if (e.key === 'F2') {
				e.preventDefault();
				setIsFeedbackModalOpen(!isFeedbackModalOpen);
			}
		};
		window.addEventListener('keydown', handleFeedbackModalOpen, {
			once: true,
		});
	}, [isFeedbackModalOpen]);

	const { playing: cheerPlaying, play: playCheer } = useAudio('cheer.mp3');

	return (
		<div className="App">
			<ThemeContext.Provider
				value={{
					theme,
					setTheme: handleSetTheme,
				}}
			>
				<GlobalStyle theme={theme} />
				{loading ? (
					<LoadingScreen />
				) : (
					<UserContext.Provider value={userProviderValue}>
						<Tutorial>
							<section className="pt-[4rem] h-full">
								<RouterSwitch />
							</section>
							{maintenance && !maintenance.hidden && (
								<MaintenanceBar
									onClose={() =>
										setMaintenance({ ...maintenance, hidden: true })
									}
									maintenance={maintenance}
								/>
							)}
							<Navbar
								handleLogout={async () => await logout()}
								setFeedbackModalOpen={setIsFeedbackModalOpen}
							/>
							{user instanceof Student && (!user.lastName || !user.firstName) && (
								<Modal
									open={oldStudentNameMigrationOpen}
									title={t('msg.auth.name_migration.title')}
									setOpen={setOldStudentNameMigrationOpen}
									size="sm"
									hideCloseButton
									hideFooter
									unclosable
								>
									<NameMigrationForm setOpen={setOldStudentNameMigrationOpen} />
								</Modal>
							)}
							{user instanceof Professor && (
								<MenuResourceCreation
									setOpen={setResourceCreationMenuOpen}
									open={resourceCreationMenuOpen}
								/>
							)}
							{isFeedbackModalOpen && (
								<FeedbackModal
									isOpen={isFeedbackModalOpen}
									setIsOpen={setIsFeedbackModalOpen}
									onSuccess={async () => {
										await playCheer();
									}}
									onFailure={() =>
										alert.error(
											'An error occurred while sending your feedback, please try again later.',
										)
									}
								/>
							)}
						</Tutorial>
					</UserContext.Provider>
				)}
			</ThemeContext.Provider>
			{cheerPlaying && <Confetti className="w-full overflow-hidden" />}
		</div>
	);
};

export default hot(App);
