import Link from '../../Components/UtilsComponents/Link/Link';
import useRoutes from '../../state/hooks/useRoutes';

const DevHome = () => {
	const { routes } = useRoutes();

	return (
		<div className="w-full h-full bg-[color:var(--background-color)] p-20">
			<div className="text-4xl mb-8">Home de développement</div>
			<div>
				<Link className="!block" dark to={routes.auth.dev_web.path}>
					To Modern Web
				</Link>
				<Link
					className="!block"
					dark
					onClick={() => alert('Not Yet Implemented')}
				>
					To React Playground
				</Link>
				<Link
					className="!block"
					dark
					onClick={() => alert('Not Yet Implemented')}
				>
					To React Learning
				</Link>
			</div>
		</div>
	);
};

export default DevHome;
