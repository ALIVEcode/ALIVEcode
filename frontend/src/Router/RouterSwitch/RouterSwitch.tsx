import { Routes, Route } from 'react-router-dom';
import useRoutes from '../../state/hooks/useRoutes';

export const RouterSwitch = () => {
	// Check in useRoutes hook to see the registered routes
	const { routes } = useRoutes();

	return (
		<Routes>
			{Object.values(routes).map(route_group =>
				Object.values(route_group).map(
					({ path, component, exact }: any, idx) => {
						return (
							<Route
								path={
									path + (path.endsWith('/') ? '' : '/') + (exact ? '' : '*')
								}
								element={component}
								key={idx + path}
							/>
						);
					},
				),
			)}
		</Routes>
	);
};