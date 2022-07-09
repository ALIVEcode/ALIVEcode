import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingScreen from '../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import { ShowcaseProject } from '../../Models/Showcase-Project/showcase-project.entity';
import api from '../../Models/api';
import { AxiosError } from 'axios';
import { useAlert } from 'react-alert';
import { useTranslation } from 'react-i18next';

const ShowcaseProjectPage = () => {
	const { name } = useParams<{ name: string }>();
	const { t } = useTranslation();
	const alert = useAlert();
	const navigate = useNavigate();
	const [project, setProject] = useState<ShowcaseProject>();

	useEffect(() => {
		if (!name) return;
		const getProject = async () => {
			try {
				const project = await api.db.showcase_projects.get({ name });
				setProject(project);
			} catch (err) {
				const axiosErr = err as AxiosError;
				if (axiosErr.response?.status === 404) {
					navigate(-1);
					return alert.error(
						t('error.not_found', { obj: t('msg.showcase_project') }),
					);
				}
				throw err;
			}
		};
		getProject();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [name]);

	if (!project) return <LoadingScreen />;

	return (
		<div>
			<label className="text-3xl">{project.name}</label>
			<img
				src={project.imgSrc}
				alt={`project-${project.name}`}
				className="w-full h-full"
			/>
			<p>{project.description}</p>
		</div>
	);
};

export default ShowcaseProjectPage;
