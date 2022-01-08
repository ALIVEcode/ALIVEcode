import { iotHomeProps } from './iotHomeTypes';
import useRoutes from '../../../state/hooks/useRoutes';
import styled from 'styled-components';
import { HomeSection } from '../../../Components/MainComponents/HomeSection/HomeSection';
import InterfaceSlideshow from '../../../assets/images/iot/interface_slideshow.png';
import DemoProject from '../../../assets/images/iot/demo_project.png';
import Footer from '../../../Components/MainComponents/Footer/Footer';
import { HomeButton } from '../../../Components/UtilsComponents/Buttons/HomeButton';
import { useTranslation } from 'react-i18next';
import {
	MutableRefObject,
	useRef,
	useLayoutEffect,
	useState,
	useCallback,
} from 'react';

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
 * @author MoSk3
 */
const IoTHome = (props: iotHomeProps) => {
	const { routes } = useRoutes();
	const getStartedRef = useRef<HTMLDivElement | null>(null);
	const [viewHeight, setViewHeight] = useState<number>(0);
	const { t } = useTranslation();

	const goToElement = (ref: MutableRefObject<any>) => {
		ref.current &&
			window.scrollTo({
				top: ref.current.getBoundingClientRect().top + window.scrollY - 100,
				behavior: 'smooth',
			});
	};

	const updateViewHeight = useCallback(() => {
		const height =
			Math.max(document.documentElement.clientHeight, window.innerHeight || 0) -
			64;
		setViewHeight(height);
	}, []);

	useLayoutEffect(() => {
		updateViewHeight();
		window.addEventListener('resize', updateViewHeight);

		return () => {
			window.removeEventListener('resize', updateViewHeight);
		};
	}, [updateViewHeight]);

	return (
		<StyledHome className="min-h-full bg-[color:#0a0a0a]">
			{/* Header */}
			<div
				className="w-full h-full bg-black relative"
				style={{ height: viewHeight + 'px' }}
			>
				<div className="tech-slideshow w-full laptop:w-2/3 z-0 opacity-20">
					<div className="mover-1"></div>
				</div>
				<div className="w-full h-full flex justify-center items-center p-4 text-center laptop:justify-start laptop:text-left laptop:p-20 laptop:pl-40 z-10 relative">
					<div>
						<div className="text-5xl laptop:text-7xl text-gray-50 font-light mb-5">
							ALIVEcode IoT
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
			<div className="text-gray-50 relative w-full h-full">
				<HomeSection
					ref={getStartedRef}
					title={t('home.iot.section.develop.title')}
					text={t('home.iot.section.develop.desc')}
					img={DemoProject}
					imgAlt="ALIVEcode's internet of things interface"
					button={t('home.iot.to_dashboard')}
					to={routes.auth.iot_dashboard.path}
					imgOpacity={0.8}
				/>
				<HomeSection
					reverse
					title={t('home.iot.section.learn.title')}
					text={t('home.iot.section.learn.desc')}
					img={DemoProject}
					imgAlt="ALIVEcode's internet of things interface"
					button={t('home.iot.to_trainings')}
					to={routes.auth.dashboard.path}
					imgOpacity={0.8}
				/>
			</div>
			<Footer className="!mt-20"></Footer>
		</StyledHome>
	);
};

export default IoTHome;
