import { ShowcaseProjectGalleryProps } from './showcaseProjectGalleryTypes';
import { useEffect, useState } from 'react';
import { classNames } from '../../../Types/utils';
import { ShowcaseProject } from '../../../Models/Showcase-Project/showcase-project.entity';
import api from '../../../Models/api';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import ShowcaseProjectCard from '../ShowcaseProjectCard/ShowcaseProjectCard';

const ShowcaseProjectGallery = ({
	nbItems,
	subject,
}: ShowcaseProjectGalleryProps) => {
	const [projects, setProjects] = useState<ShowcaseProject[]>();

	useEffect(() => {
		const getProjects = async () => {
			const projects = await api.db.showcase_projects.getGallery({
				subject,
				nbItems,
			});
			setProjects(projects);
		};
		getProjects();
	}, [nbItems, subject]);

	if (!projects) return <LoadingScreen relative></LoadingScreen>;

	return (
		<div
			className={classNames(
				'grid gap-10 mt-12 place-items-center',
				'grid-cols-1',
				'tablet:grid-cols-2',
				'laptop:grid-cols-3',
			)}
		>
			{projects.map((p, idx) => (
				<ShowcaseProjectCard key={idx} project={p} />
			))}
		</div>
	);
};

export default ShowcaseProjectGallery;
