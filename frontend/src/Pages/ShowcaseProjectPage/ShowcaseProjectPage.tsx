import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingScreen from '../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import { ShowcaseProject } from '../../Models/Showcase-Project/showcase-project.entity';
import api from '../../Models/api';
import { AxiosError } from 'axios';
import { useAlert } from 'react-alert';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../Types/formatting';
import EmbeddedVideo from '../../Components/UtilsComponents/EmbeddedVideo/EmbeddedVideo';
import Footer from '../../Components/MainComponents/Footer/Footer';
import Link from '../../Components/UtilsComponents/Link/Link';
import { classNames } from '../../Types/utils';

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
		<>
			<div className="relative w-full h-full bg-[color:#0a0a0a]">
				<div
					className="w-full h-full relative opacity-40 bg-center bg-cover"
					style={{ backgroundImage: `url('${project.imgSrc}')` }}
				/>
				<div className="w-full h-full absolute top-0 flex items-center justify-center text-center">
					<div>
						<label className="text-4xl tablet:text-6xl laptop:text-7xl text-white block tracking-wide mb-2">
							{project.getName(t)}
						</label>
						<div>
							<label className="text-base tablet:text-xl text-gray-300 tracking-widest">
								{formatDate(project.startDate, t, {
									hideDay: true,
									hideTime: true,
								})}
								{project.finishDate &&
									' — ' +
										formatDate(project.finishDate, t, {
											hideDay: true,
											hideTime: true,
										})}
								{!project.finishDate &&
									project.ongoing &&
									' — ' + t('msg.time.today')}
							</label>
						</div>
					</div>
				</div>
				<div className="absolute bottom-2 w-full">
					<label className="text-white text-sm tablet:text-base tracking-widest block text-center px-2">
						{t('msg.by')}
						{': '}
						{project.contributors.map(personName => personName).join(', ')}
					</label>
				</div>
			</div>
			<div className="bg-[color:var(--background-color)] px-8 tablet:px-16 laptop:px-32 desktop:px-48 py-16 desktop:py-32">
				<div
					className={classNames(
						'text-justify leading-relaxed tracking-wider font-light',
						(project.videoUrl || project.learnMoreUrl) && 'mb-16 desktop:mb-32',
					)}
				>
					{project
						.getDescription(t)
						.split('\n')
						.map((txt: string) => (
							<div className="mb-6">{txt}</div>
						))}
				</div>
				{project.videoUrl && (
					<div className={project.learnMoreUrl && 'mb-16 desktop:mb-32'}>
						<EmbeddedVideo url={project.videoUrl} />
					</div>
				)}
				{project.learnMoreUrl && (
					<div className="text-xl flex justify-center items-center text-center">
						<Link openInNewTab outsideLink to={project.learnMoreUrl}>
							{t('msg.learn_more')}
						</Link>
					</div>
				)}
			</div>
			<Footer className="!mt-0" />
		</>
	);
};

export default ShowcaseProjectPage;
