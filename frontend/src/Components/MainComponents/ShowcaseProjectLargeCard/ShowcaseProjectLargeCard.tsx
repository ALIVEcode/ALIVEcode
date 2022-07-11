import { ShowcaseProjectLargeCardProps } from './showcaseProjectLargeCardTypes';
import EmbeddedVideo from '../../UtilsComponents/EmbeddedVideo/EmbeddedVideo';
import { useTranslation } from 'react-i18next';
import Link from '../../UtilsComponents/Link/Link';
import useRoutes from '../../../state/hooks/useRoutes';
import { useEffect, useState } from 'react';
import { ShowcaseProject } from '../../../Models/Showcase-Project/showcase-project.entity';
import api from '../../../Models/api';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';

const ShowcaseProjectLargeCard = ({
	projectName,
}: ShowcaseProjectLargeCardProps) => {
	const { t } = useTranslation();
	const { routes } = useRoutes();
	const [project, setProject] = useState<ShowcaseProject>();

	useEffect(() => {
		const getProject = async () => {
			const project = await api.db.showcase_projects.get({ name: projectName });
			setProject(project);
		};
		getProject();
	}, [projectName]);

	if (!project) return <LoadingScreen relative />;

	return (
		<>
			<div className="tracking-widest mt-8 mb-4 text-xl tablet:text-2xl">
				{project.getName(t)}
			</div>
			{project.videoUrl ? (
				<EmbeddedVideo url={project.videoUrl} />
			) : (
				<img src={project.imgSrc} alt={`project-${project.nameId}`}></img>
			)}
			<div className="mt-4">
				<Link
					openInNewTab
					outsideLink
					to={routes.public.showcase_project.path.replace(
						':name',
						project.nameId,
					)}
					className="text-lg"
				>
					{t('msg.learn_more')}
				</Link>
			</div>
		</>
	);
};

export default ShowcaseProjectLargeCard;
