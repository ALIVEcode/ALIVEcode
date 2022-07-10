import { iotHomeProps } from './iotHomeTypes';
import styled from 'styled-components';
import InterfaceSlideshow from '../../../assets/images/iot/interface_slideshow.png';
import ConstructionFeux from '../../../assets/images/iot/construction_feux.jpg';
import CodeAS from '../../../assets/images/iot/ecosysteme_as.png';
import VilleIntelligenteInterface from '../../../assets/images/iot/ville_intelligente_interface.png';
import Footer from '../../../Components/MainComponents/Footer/Footer';
import { HomeButton } from '../../../Components/UtilsComponents/Buttons/HomeButton';
import { useTranslation } from 'react-i18next';
import useView from '../../../state/hooks/useView';
import { forwardRef, MutableRefObject, useRef } from 'react';
import { classNames } from '../../../Types/utils';
import FeaturedCourseContainer from '../../../Components/CourseComponents/CourseContainer/CourseContainer';
import { SUBJECTS } from '../../../Types/sharedTypes';
import ShowcaseProjectGallery from '../../../Components/MainComponents/ShowcaseProjectGallery/ShowcaseProjectGallery';

const StyledHome = styled.div`
	.tech-slideshow {
		right: 0;
		height: 100%;
		max-width: 100%;
		margin: 0 auto;
		position: absolute;
		overflow: hidden;
		transform: translate3d(0, 0, 0);
	}

	.tech-slideshow > div {
		width: 100%;
		height: 2644px;
		background: url('${InterfaceSlideshow}');
		background-size: contain;
		position: absolute;
		top: 0;
		left: 0;
		transform: translate3d(0, 0, 0);
	}

	.tech-slideshow .mover-1 {
		animation: moveSlideshow 70s linear infinite;
	}

	@keyframes moveSlideshow {
		100% {
			transform: translateY(-56%);
		}
	}
`;

/**
 * Home of the IoT branch
 *
 * @author Enric Soldevila
 */
const IoTHome = (props: iotHomeProps) => {
	const getStartedRef = useRef<HTMLDivElement | null>(null);
	const view = useView();
	const { t } = useTranslation();

	const paragraphClassName =
		'text-center text-base tablet:text-lg leading-loose tracking-wider';

	const goToElement = (ref: MutableRefObject<any>) => {
		ref.current &&
			window.scrollTo({
				top: ref.current.getBoundingClientRect().top + window.scrollY - 100,
				behavior: 'smooth',
			});
	};

	return (
		<StyledHome className="min-h-full bg-[color:#0a0a0a]">
			{/* Header */}
			<div
				className="w-full h-full bg-black relative"
				style={{ height: view.height + 'px' }}
			>
				<div className="tech-slideshow w-full laptop:w-2/3 z-0 opacity-20">
					<div className="mover-1"></div>
				</div>
				<div className="w-full h-full flex justify-center items-center p-4 text-center laptop:justify-start laptop:text-left laptop:p-20 laptop:pl-40 z-10 relative">
					<div>
						<div className="text-5xl laptop:text-7xl text-gray-50 font-light mb-5">
							ALIVEIoT
						</div>
						<div className="text-2xl laptop:text-3xl desktop:text-4xl text-gray-200 font-extralight mb-10">
							{t('home.iot.desc')}
						</div>
						<HomeButton onClick={() => goToElement(getStartedRef)}>
							{t('home.get_started')}
						</HomeButton>
					</div>
				</div>
			</div>

			<div className="text-gray-50 relative w-full h-full px-10 tablet:px-18 laptop:px-16 desktop:px-32">
				<p className={paragraphClassName + ' mt-32'}>
					ALIVEIoT est la branche d’ALIVEcode servant à l’apprentissage de
					l’Internet des Objets, un domaine de l’informatique possédant très peu
					de ressources au niveau collégial. La branche ALIVEIoT utilise des
					outils novateurs et conçus dans le but de simplifier l’apprentissage
					et la recherche scientifique. Ces outils permettent notamment:
				</p>
				<ul className="text-center text-gray-300 mt-8 leading-loose tracking-wider mb-32">
					<li>La visualisation de données en temps réel</li>
					<li>Le partage de donneés entre objets connectés</li>
					<li>
						Le contrôle d’objets connectés à l’aide du langage AliveScript
					</li>
				</ul>

				<IoTHomeSeparator title={'Projets en vedette'} />
				<div className="px-0 tablet:px-4 laptop:px-10 desktop:px-28">
					<IoTFeaturedProjectBig
						title="Ville Intelligente"
						youtubeVideoId="a-wLMgqOz9E"
					/>
					<IoTFeaturedProjectBig
						title="Serre Connectée"
						youtubeVideoId="a-wLMgqOz9E"
					/>
				</div>

				<IoTHomeSeparator ref={getStartedRef} title={'Commencer à apprendre'} />
				<p
					className={
						paragraphClassName +
						' mt-8 px-0 tablet:px-4 laptop:px-10 desktop:px-28'
					}
				>
					Apprends la théorie et la pratique de l'IoT. Suis une ou plusieurs
					formations complètes offertes par ALIVEcode qui t'apprendront tout ce
					qui t'est requis afin de commencer à développer tes propres projets
					IoT. L'électronique, les protocoles de communication, les bases de
					données, l'IA, l'interfaçage, etc.
				</p>

				<FeaturedCourseContainer
					className="my-12"
					title="Cours offerts par ALIVEcode"
					featuring={SUBJECTS.IOT}
					featuringFrom="alivecode"
					dark
				/>
				{/*
				<FeaturedCourseContainer
					className="mt-12 mb-12"
					title="Cours offerts par la communauté"
					featuring={SUBJECTS.IOT}
					featuringFrom="public"
					dark
				/>
				 */}
				<IoTHomeSeparator title={'Les étapes à suivre'} />
				<IoTStepSection
					title={'Conception des objets connectés*'}
					text={t('home.iot.section.develop.desc')}
					img={ConstructionFeux}
					imgAlt="ALIVEcode's internet of things interface"
				/>
				<IoTStepSection
					title={'Connection et visualisation'}
					text={t('home.iot.section.develop.desc')}
					img={VilleIntelligenteInterface}
					imgAlt="ALIVEcode's internet of things interface"
				/>
				<IoTStepSection
					title={'Contrôle de l’écosystème'}
					text={t('home.iot.section.develop.desc')}
					img={CodeAS}
					imgAlt="ALIVEcode's internet of things interface"
				/>
				<IoTHomeSeparator title={'Plus de projets'} className="mt-16" />
				<ShowcaseProjectGallery nbItems={6} subject={SUBJECTS.IOT} />
			</div>
			<Footer className="!mt-4"></Footer>
		</StyledHome>
	);
};

export default IoTHome;

const IoTHomeSeparator = forwardRef<
	HTMLDivElement,
	{ title: string; className?: string }
>(({ title, className }, ref) => {
	return (
		<div className={'text-center ' + className} ref={ref}>
			<label className="text-3xl tablet:text-5xl">{title}</label>
			<div className="m-auto w-1/2 border-b-2 mt-4 border-[color:var(--fg-shade-two-color)]"></div>
		</div>
	);
});

const IoTFeaturedProjectBig = ({
	title,
	youtubeVideoId,
}: {
	title: string;
	youtubeVideoId: string;
}) => {
	return (
		<>
			<div className="tracking-widest mt-8 mb-4 text-xl tablet:text-2xl">
				{title}
			</div>
			<iframe
				className="m-auto w-full aspect-video mb-16"
				src={`https://youtube.com/embed/${youtubeVideoId}`}
				title="YouTube video player"
				frameBorder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			/>
		</>
	);
};

export type HomeSectionProps = {
	title: string;
	text: string;
	img: string;
	imgAlt: string;
	reverse?: boolean;
	button?: string;
	onClick?: () => void;
	imgOpacity?: number;
	to?: string;
	important?: boolean;
};

const IoTStepSection = forwardRef<HTMLDivElement, HomeSectionProps>(
	(
		{
			title,
			text,
			img,
			imgAlt,
			reverse,
			button,
			imgOpacity,
			important,
			...buttonProps
		},
		ref,
	) => {
		return (
			<div
				className={classNames(
					'w-full h-full flex justify-between flex-col items-center font-normal gap-4 mt-20 rounded-3xl laptop:bg-transparent',
					'tablet:gap-8',
					'laptop:gap-16',
					'desktop:gap-32',
					reverse ? 'tablet:flex-row-reverse' : 'tablet:flex-row',
				)}
				ref={ref}
			>
				<div className="tablet:w-3/5 laptop:w-[45%] h-full">
					<img
						src={img}
						alt={imgAlt}
						className={'w-full h-auto '}
						style={{ opacity: imgOpacity }}
					/>
				</div>
				<div className="tablet:w-2/5 laptop:w-[55%] flex items-center">
					<div>
						<div
							className={classNames(
								'tracking-wider',
								important
									? 'font-semibold text-4xl tablet:text-3xl laptop:text-4xl desktop:text-5xl mb-6 tablet:mb-7 desktop:mb-10'
									: 'text-3xl tablet:text-2xl laptop:text-3xl desktop:text-4xl mb-6 tablet:mb-3 desktop:mb-6',
							)}
						>
							{title}
						</div>
						<div
							className={classNames(
								'tracking-widest tablet:leading-normal desktop:leading-relaxed text-justify text-gray-300',
								important
									? 'text-2xl tablet:text-lg laptop:text-2xl desktop:text-3xl'
									: 'text-xl tablet:text-base laptop:text-xl desktop:text-2xl',
							)}
						>
							{text}
						</div>
						{button && (
							<HomeButton
								className="mt-5 tracking-wide !text-lg !px-4 !py-2 tablet:!text-base laptop:!text-lg"
								{...buttonProps}
							>
								{button}
							</HomeButton>
						)}
					</div>
				</div>
			</div>
		);
	},
);
