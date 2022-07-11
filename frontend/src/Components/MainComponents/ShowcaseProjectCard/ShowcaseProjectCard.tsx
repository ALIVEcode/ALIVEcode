import Link from '../../UtilsComponents/Link/Link';
import { ShowcaseProjectProps } from './showcaseProjectCardTypes';
import useRoutes from '../../../state/hooks/useRoutes';
import { useTranslation } from 'react-i18next';

const ShowcaseProjectCard = ({ project }: ShowcaseProjectProps) => {
	const { routes, goToNewTab } = useRoutes();
	const { t } = useTranslation();

	const goToProject = () => {
		goToNewTab(
			routes.public.showcase_project.path.replace(':name', project.nameId),
		);
	};

	return (
		<div className="w-80 h-64 relative">
			<img
				src={project.imgSrc}
				alt={`project-${project.nameId}`}
				className="w-full h-full"
			/>
			<div
				className="group absolute top-0 right-0 bottom-0 left-0 cursor-pointer"
				onClick={goToProject}
			>
				<div className="absolute top-0 w-full h-full bg-black opacity-0 group-hover:opacity-70 duration-500 transition-opacity"></div>
				<div className="relative w-full h-full opacity-0 group-hover:opacity-100 duration-500 transition-opacity p-4">
					<div className="text-2xl text-white tracking-wide h-10">
						{project.getName(t)}
					</div>
					<div className="text-gray-300 h-36 text-ellipsis overflow-hidden mb-1">
						{project.getDescription(t)}
					</div>
					<Link onClick={goToProject}>{t('msg.continue_reading')}</Link>
				</div>
			</div>
		</div>
	);
};

export default ShowcaseProjectCard;
