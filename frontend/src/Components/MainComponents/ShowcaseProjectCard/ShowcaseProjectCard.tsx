import Link from '../../UtilsComponents/Link/Link';
import { ShowcaseProjectProps } from './showcaseProjectCardTypes';
import useRoutes from '../../../state/hooks/useRoutes';
import { useTranslation } from 'react-i18next';

const ShowcaseProjectCard = ({ project }: ShowcaseProjectProps) => {
	const { routes } = useRoutes();
	const { t } = useTranslation();

	return (
		<div className="w-80 h-64 relative">
			<img
				src={project.imgSrc}
				alt={`project-${project.name}`}
				className="w-full h-full"
			/>
			<div className="group absolute top-0 right-0 bottom-0 left-0 cursor-pointer">
				<div className="absolute top-0 w-full h-full bg-black opacity-0 group-hover:opacity-60 duration-500 transition-opacity"></div>
				<div className="relative w-full h-full opacity-0 group-hover:opacity-100 duration-500 transition-opacity p-4">
					<div className="text-2xl tracking-wide h-10">{project.name}</div>
					<div className="text-gray-300 h-36 text-ellipsis overflow-hidden mb-1">
						{project.description}
					</div>
					<Link
						to={routes.public.showcase_project.path.replace(
							':name',
							project.name,
						)}
					>
						{t('msg.continue_reading')}
					</Link>
				</div>
			</div>
		</div>
	);
};

export default ShowcaseProjectCard;
