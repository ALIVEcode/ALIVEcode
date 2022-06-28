import { iotHomeProps } from './iotHomeTypes';
import styled from 'styled-components';
import InterfaceSlideshow from '../../../assets/images/iot/interface_slideshow.png';
import Footer from '../../../Components/MainComponents/Footer/Footer';
import { HomeButton } from '../../../Components/UtilsComponents/Buttons/HomeButton';
import { useTranslation } from 'react-i18next';
import useView from '../../../state/hooks/useView';
import { MutableRefObject, useRef } from 'react';

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

	const paragraphClassName = 'text-center text-lg leading-loose tracking-wider';

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
			<div className="text-gray-50 relative w-full h-full px-10 tablet:px-18 laptop:px-32">
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
				<div className="text-center">
					<label className="text-5xl">Projets en vedette</label>
					<div className="m-auto w-1/2 border-b-2 mt-4 border-[color:var(--fg-shade-two-color)]"></div>
				</div>

				<div className="tracking-widest mt-8 mb-4 text-2xl">
					Ville Intelligente
				</div>
				<iframe
					className="m-auto w-full aspect-video mb-16"
					src={`https://youtube.com/embed/a-wLMgqOz9E`}
					title="YouTube video player"
					frameBorder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
				/>
				<div className="text-center">
					<label className="text-5xl">Commencer à apprendre</label>
					<div className="m-auto w-1/2 border-b-2 mt-4 border-[color:var(--fg-shade-two-color)]"></div>
				</div>
				<p className={paragraphClassName + ' mt-8'}>
					Apprends la théorie et la pratique de l'IoT. Suis une ou plusieurs
					formations complètes offertes par ALIVEcode qui t'apprendront tout ce
					qui t'est requis afin de commencer à développer tes propres projets
					IoT. L'électronique, les protocoles de communication, les bases de
					données, l'IA, l'interfaçage, etc.
				</p>
				{/*<HomeSection
					ref={getStartedRef}
					title={t('home.iot.section.develop.title')}
					text={t('home.iot.section.develop.desc')}
					img={DemoProject}
					imgAlt="ALIVEcode's internet of things interface"
					button={t('home.iot.to_dashboard')}
					to={routes.auth.dashboard.path + '/iot'}
					imgOpacity={0.8}
				/>
				<HomeSection
					reverse
					title={t('home.iot.section.learn.title')}
					text={t('home.iot.section.learn.desc')}
					img={DemoProject}
					imgAlt="ALIVEcode's internet of things interface"
					button={t('home.iot.to_trainings')}
					to={routes.auth.classroom_browse.path}
					imgOpacity={0.8}
	/>*/}
			</div>
			<Footer className="!mt-4"></Footer>
		</StyledHome>
	);
};

export default IoTHome;
