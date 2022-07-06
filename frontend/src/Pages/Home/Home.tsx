import { HomeProps, StyledHome } from './homeTypes';
import Footer from '../../Components/MainComponents/Footer/Footer';
import VoitureAnimee from '../../assets/images/Voiture.gif';
import TypeWriter from '../../Components/UtilsComponents/TypeWriter/TypeWriter';
import { useTranslation } from 'react-i18next';
import { MutableRefObject, useContext, useRef, useState } from 'react';
import { ThemeContext } from '../../state/contexts/ThemeContext';
import { HomeButton } from '../../Components/UtilsComponents/Buttons/HomeButton';
import { HomeSection } from '../../Components/MainComponents/HomeSection/HomeSection';
import useRoutes from '../../state/hooks/useRoutes';
import { classNames } from '../../Types/utils';
import OurMission from '../../assets/images/home/our_mission.jpg';
import OurStory from '../../assets/images/home/our_story.jpg';
import WhoAreWe from '../../assets/images/home/who_are_we.jpg';
import TrainingAI from '../../assets/images/home/training_AI.jpg';
import TrainingIoT from '../../assets/images/home/training_IoT.jpg';
import TrainingCode from '../../assets/images/home/training_Code.jpg';
import Modal from '../../Components/UtilsComponents/Modal/Modal';
import Link from '../../Components/UtilsComponents/Link/Link';
import { useNavigate } from 'react-router';
import useView from '../../state/hooks/useView';

/**
 * Home page of ALIVEcode
 *
 * @author Enric Soldevila
 */
const Home = (props: HomeProps) => {
	const { t } = useTranslation();
	const { theme } = useContext(ThemeContext);
	const { routes } = useRoutes();
	const [linksOpen, setLinksOpen] = useState(false);
	const view = useView();
	const navigate = useNavigate();
	const aboutRef = useRef<HTMLDivElement | null>(null);
	const trainingsRef = useRef<HTMLDivElement | null>(null);
	const newsRef = useRef<HTMLDivElement | null>(null);

	const tabs = [
		{
			name: t('home.about'),
			ref: aboutRef,
		},
		{
			name: t('home.trainings'),
			ref: trainingsRef,
		},
		{
			name: t('home.news'),
			ref: newsRef,
		},
	];

	const goToElement = (ref: MutableRefObject<any>) => {
		ref.current &&
			window.scrollTo({
				top: ref.current.getBoundingClientRect().top + window.scrollY - 150,
				behavior: 'smooth',
			});
	};

	return (
		<StyledHome
			className={classNames(
				'relative w-full overflow-x-hidden',
				theme.name === 'light' &&
					'bg-[color:rgba(var(--background-color-rgb),0.7)]',
				theme.name === 'dark' && 'bg-[color:#18181fda]',
			)}
		>
			<div
				className={classNames(
					'header-circle absolute rounded-[50%] hidden tablet:block',
					'desktop:w-[1235px] desktop:h-[1235px] desktop:left-auto desktop:right-[-430px] desktop:top-[-430px]',
					'laptop:w-[1100px]  laptop:h-[1100px]  laptop:left-[550px]  laptop:top-[-400px]',
					'tablet:w-[900px]   tablet:h-[900px]   tablet:left-[400px]  tablet:top-[-300px]',
				)}
			>
				<img
					className="relative tablet:opacity-100 tablet:top-[35%] tablet:left-[10%] tablet:w-[55%] tablet:h-[55%]"
					alt="alive car designed at LRIMa"
					src={VoitureAnimee}
				/>
			</div>
			<div
				className={classNames(
					'header tablet:block tablet:flex-row w-full overflow-hidden tablet:text-left',
					'desktop:px-20 desktop:py-18',
					'laptop:px-16 laptop:py-14',
					'tablet:px-14 tablet:py-12',
					'px-4 py-4', // Mobile view
				)}
			>
				<div
					className={classNames(
						'z-10 w-full h-full relative tablet:text-left',
						'tablet:text-left tablet:items-start',
						'justify-center text-center flex flex-col items-center', // mobile view
					)}
				>
					<div className="absolute z-0 left-0 right-0">
						<img
							className="relative tablet:hidden w-[100%] h-[100%] opacity-[0.15] mt-[-30px]"
							alt="alive car designed at LRIMa"
							src={VoitureAnimee}
						/>
					</div>
					<div
						className={classNames(
							'relative text-[70px] tablet:text-[63px] laptop:text-[90px] desktop:text-[120px]',
							'flex flex-col tablet:inline',
						)}
					>
						<label className="header-alive">ALIVE</label>
						<label className="header-desc text-[0.6em] tablet:text-[0.75em] mt-[-20px] tablet:mt-0">
							<TypeWriter
								lines={[t('home.msg1'), t('home.msg2'), t('home.msg3')]}
								typeSpeed={200}
								eraseSpeed={150}
								delayAfterWrite={5000}
								delayAfterErase={500}
								shadow
								startWithText
							/>
						</label>
						
					</div>
					<div className="relative mb-8 mt-4 tablet:mt-[-5px] laptop:mt-[-15px] text-[25px] tablet:text-[20px] laptop:text-[27px] desktop:text-[35px]">
						{t('home.desc')}
					</div>
					<HomeButton
						className="block relative"
						onClick={() => navigate(routes.auth.dashboard.path)}
					>
						{t('home.get_started')}
					</HomeButton>
				</div>
			</div>
			<svg
				className="curve mt-[-0.2rem]"
				viewBox="0 0 1616 215"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M1920 0H0V119.542C0 119.542 638 -39.3132 866 140C1094 319.313 1920 119.542 1920 119.542V0Z"
					fill={theme.color.primary}
				/>
			</svg>
			<div className="sticky w-full top-[4rem] border-b mt-4 tablet:mt-0">
				<nav
					className={classNames(
						'flex flex-row w-full px-4 text-center text-xl font-normal text-[color:var(--fg-shade-four-color)]',
						'tablet:px-20 tablet:text-left tablet:gap-8',
					)}
				>
					{tabs.map((t, idx) => (
						<div
							key={idx}
							className="w-1/3 tablet:w-auto border-b border-transparent hover:border-[color:rgba(var(--foreground-color-rgb),0.3)] py-2 cursor-pointer transition-all"
							onClick={() => goToElement(t.ref)}
						>
							{t.name}
						</div>
					))}
				</nav>
			</div>
			<div
				ref={aboutRef}
				className="px-5 tablet:px-10 laptop:px-20 mt-10 mb-10 z-10 relative"
			>
				<label className="inline-block text-6xl font-light w-auto border-b border-[color:var(--fg-shade-four-color)] pr-10 pb-2">
					<span>{t('msg.section.about')}</span>
				</label>
				<HomeSection
					title={t('home.section.mission.title')}
					text={t('home.section.mission.desc')}
					img={OurMission}
					imgAlt="ALIVEcode's website mission"
					important
				/>
				<HomeSection
					title={t('home.section.us.title')}
					text={t('home.section.us.desc', { test: 'dawawdawd' })}
					reverse
					img={WhoAreWe}
					onClick={() => setLinksOpen(true)}
					button={t('msg.see_links')}
					imgAlt="The team of ALIVEcode"
				/>
				<HomeSection
					title={t('home.section.story.title')}
					text={t('home.section.story.desc')}
					img={OurStory}
					imgAlt="The story of how ALIVEcode was created"
				/>
			</div>
			<div className="mt-[-32rem] mb-[-28rem] tablet:mb-[-20rem] laptop:mb-[-16rem] z-0 relative w-full">
				<svg
					className="w-full"
					preserveAspectRatio={view.screenType === 'desktop' ? 'none' : 'width'}
					width="1600"
					height="1203"
					viewBox="0 0 1616 1203"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						className="w-full"
						d="M-1 920.256L37.6044 913.046C76.2089 905.721 153.418 891.301 230.268 900.571C307.297 909.956 383.788 943.144 460.817 945.09C537.667 946.921 614.876 917.623 691.725 915.106C768.755 912.588 845.245 937.079 922.275 946.578C999.124 956.077 1076.33 950.812 1153.18 953.788C1230.21 956.878 1306.7 968.322 1383.73 974.617C1460.58 980.911 1537.79 982.056 1576.4 982.628L1615 983.2V631.856H1576.4C1537.79 631.856 1460.58 631.856 1383.73 631.856C1306.7 631.856 1230.21 631.856 1153.18 631.856C1076.33 631.856 999.124 631.856 922.275 631.856C845.245 631.856 768.755 631.856 691.725 631.856C614.876 631.856 537.667 631.856 460.817 631.856C383.788 631.856 307.297 631.856 230.268 631.856C153.418 631.856 76.2089 631.856 37.6044 631.856H-1V920.256Z"
						fill="#4FADFF"
					/>
					<path
						className="w-full"
						d="M-1 936.278L37.6044 918.31C76.2089 900.457 153.418 864.521 230.268 851.932C307.297 839.343 383.788 850.101 460.817 867.382C537.667 884.778 614.876 908.811 691.725 912.817C768.755 916.822 845.245 900.8 922.275 896.451C999.124 891.988 1076.33 899.312 1153.18 905.149C1230.21 911.1 1306.7 915.678 1383.73 905.378C1460.58 895.078 1537.79 869.9 1576.4 857.311L1615 844.722V631.855H1576.4C1537.79 631.855 1460.58 631.855 1383.73 631.855C1306.7 631.855 1230.21 631.855 1153.18 631.855C1076.33 631.855 999.124 631.855 922.275 631.855C845.245 631.855 768.755 631.855 691.725 631.855C614.876 631.855 537.667 631.855 460.817 631.855C383.788 631.855 307.297 631.855 230.268 631.855C153.418 631.855 76.2089 631.855 37.6044 631.855H-1V936.278Z"
						fill="#6FB3FF"
					/>
					<path
						className="w-full"
						d="M-1 794.367L37.6044 805.239C76.2089 816.111 153.418 837.856 230.268 838.771C307.297 839.801 383.788 819.888 460.817 821.604C537.667 823.321 614.876 846.668 691.725 860.744C768.755 874.821 845.245 879.857 922.275 878.827C999.124 877.911 1076.33 871.044 1153.18 863.033C1230.21 855.022 1306.7 845.867 1383.73 835.91C1460.58 826.068 1537.79 815.31 1576.4 810.046L1615 804.667V631.855H1576.4C1537.79 631.855 1460.58 631.855 1383.73 631.855C1306.7 631.855 1230.21 631.855 1153.18 631.855C1076.33 631.855 999.124 631.855 922.275 631.855C845.245 631.855 768.755 631.855 691.725 631.855C614.876 631.855 537.667 631.855 460.817 631.855C383.788 631.855 307.297 631.855 230.268 631.855C153.418 631.855 76.2089 631.855 37.6044 631.855H-1V794.367Z"
						fill="#87BAFF"
					/>
					<path
						className="w-full"
						d="M-1 828.7H37.6044C76.2089 828.7 153.418 828.7 230.268 828.7C307.297 828.7 383.788 828.7 460.817 826.068C537.667 823.321 614.876 818.057 691.725 807.757C768.755 797.457 845.245 782.121 922.275 778.344C999.124 774.568 1076.33 782.121 1153.18 791.162C1230.21 800.089 1306.7 810.389 1383.73 814.165C1460.58 818.057 1537.79 815.31 1576.4 814.051L1615 812.678V631.855H1576.4C1537.79 631.855 1460.58 631.855 1383.73 631.855C1306.7 631.855 1230.21 631.855 1153.18 631.855C1076.33 631.855 999.124 631.855 922.275 631.855C845.245 631.855 768.755 631.855 691.725 631.855C614.876 631.855 537.667 631.855 460.817 631.855C383.788 631.855 307.297 631.855 230.268 631.855C153.418 631.855 76.2089 631.855 37.6044 631.855H-1V828.7Z"
						fill="#9BC0FF"
					/>
					<path
						className="w-full"
						d="M-1 754.311L37.6044 757.973C76.2089 761.521 153.418 768.846 230.268 763.81C307.297 758.889 383.788 741.722 460.817 737.488C537.667 733.368 614.876 742.066 691.725 751.45C768.755 760.834 845.245 770.677 922.275 768.388C999.124 766.099 1076.33 751.679 1153.18 748.017C1230.21 744.354 1306.7 751.679 1383.73 748.932C1460.58 746.3 1537.79 733.711 1576.4 727.417L1615 721.122V631.856H1576.4C1537.79 631.856 1460.58 631.856 1383.73 631.856C1306.7 631.856 1230.21 631.856 1153.18 631.856C1076.33 631.856 999.124 631.856 922.275 631.856C845.245 631.856 768.755 631.856 691.725 631.856C614.876 631.856 537.667 631.856 460.817 631.856C383.788 631.856 307.297 631.856 230.268 631.856C153.418 631.856 76.2089 631.856 37.6044 631.856H-1V754.311Z"
						fill="#ACC8FF"
					/>
					<path
						className="w-full"
						d="M-1 592.081L37.6044 588.419C76.2089 584.871 153.418 577.547 230.268 582.583C307.297 587.504 383.788 604.67 460.817 608.905C537.667 613.025 614.876 604.327 691.725 594.943C768.755 585.558 845.245 575.716 922.275 578.005C999.124 580.294 1076.33 594.714 1153.18 598.376C1230.21 602.038 1306.7 594.714 1383.73 597.46C1460.58 600.093 1537.79 612.681 1576.4 618.976L1615 625.27V714.537H1576.4C1537.79 714.537 1460.58 714.537 1383.73 714.537C1306.7 714.537 1230.21 714.537 1153.18 714.537C1076.33 714.537 999.124 714.537 922.275 714.537C845.245 714.537 768.755 714.537 691.725 714.537C614.876 714.537 537.667 714.537 460.817 714.537C383.788 714.537 307.297 714.537 230.268 714.537C153.418 714.537 76.2089 714.537 37.6044 714.537H-1V592.081Z"
						fill="#ACC8FF"
					/>
					<path
						className="w-full"
						d="M-1 709.678L37.6044 710.822C76.2089 711.967 153.418 714.256 230.268 714.027C307.297 713.912 383.788 711.166 460.817 707.618C537.667 703.956 614.876 699.378 691.725 697.089C768.755 694.8 845.245 694.8 922.275 694.228C999.124 693.656 1076.33 692.511 1153.18 691.367C1230.21 690.222 1306.7 689.078 1383.73 689.879C1460.58 690.566 1537.79 693.312 1576.4 694.571L1615 695.945V631.856H1576.4C1537.79 631.856 1460.58 631.856 1383.73 631.856C1306.7 631.856 1230.21 631.856 1153.18 631.856C1076.33 631.856 999.124 631.856 922.275 631.856C845.245 631.856 768.755 631.856 691.725 631.856C614.876 631.856 537.667 631.856 460.817 631.856C383.788 631.856 307.297 631.856 230.268 631.856C153.418 631.856 76.2089 631.856 37.6044 631.856H-1V709.678Z"
						fill="#BCCFFF"
					/>
					<path
						className="w-full"
						d="M-14 609.274L24.6044 608.13C63.2089 606.985 140.418 604.696 217.268 604.925C294.297 605.04 370.788 607.786 447.817 611.334C524.667 614.996 601.876 619.574 678.725 621.863C755.755 624.152 832.245 624.152 909.275 624.724C986.124 625.296 1063.33 626.441 1140.18 627.585C1217.21 628.73 1293.7 629.874 1370.73 629.073C1447.58 628.386 1524.79 625.64 1563.4 624.381L1602 623.007V687.096H1563.4C1524.79 687.096 1447.58 687.096 1370.73 687.096C1293.7 687.096 1217.21 687.096 1140.18 687.096C1063.33 687.096 986.124 687.096 909.275 687.096C832.245 687.096 755.755 687.096 678.725 687.096C601.876 687.096 524.667 687.096 447.817 687.096C370.788 687.096 294.297 687.096 217.268 687.096C140.418 687.096 63.2089 687.096 24.6044 687.096H-14V609.274Z"
						fill="#BCCFFF"
					/>
					<ellipse
						cx="1512"
						cy="936.214"
						rx="276"
						ry="266.214"
						fill="#92B7FF"
						fillOpacity="0.64"
					/>
					<circle
						cx="-115"
						cy="450"
						r="450"
						fill="#92B7FF"
						fillOpacity="0.64"
					/>
				</svg>
			</div>

			<div
				ref={trainingsRef}
				className="px-5 tablet:px-10 laptop:px-20 mt-5 mb-10 z-10 relative"
			>
				<label className="inline-block text-6xl font-light w-auto border-b border-[color:var(--fg-shade-four-color)] pr-10 pb-2">
					<span>{t('home.trainings')}</span>
				</label>
				<HomeSection
					title={t('home.section.training_ai.title')}
					text={t('home.section.training_ai.desc')}
					img={TrainingAI}
					imgAlt="Training of Artificial Intelligence on ALIVEcode"
					button={t('home.see_trainings')}
					to={routes.auth.classroom_browse.path}
				/>
				<HomeSection
					title={t('home.section.training_iot.title')}
					text={t('home.section.training_iot.desc')}
					reverse
					img={TrainingIoT}
					imgAlt="Training of Internet of Things on ALIVEcode"
					button={t('home.see_trainings')}
					to={routes.auth.classroom_browse.path}
				/>
				<HomeSection
					title={t('home.section.training_code.title')}
					text={t('home.section.training_code.desc')}
					img={TrainingCode}
					imgAlt="Training of the basics of coding on ALIVEcode"
					button={t('home.see_trainings')}
					to={routes.auth.classroom_browse.path}
				/>
			</div>
			<div className="mt-32 w-full">
				<svg
					className="w-full h-full"
					width="1615"
					height="595"
					viewBox="0 0 1615 595"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					preserveAspectRatio={view.screenType === 'desktop' ? 'none' : 'width'}
				>
					<path
						d="M-1 9.86679L28.9858 10.9835C58.792 12.1001 118.764 14.3335 178.556 16.1201C238.348 18.1301 298.319 19.4701 358.111 22.8201C417.903 26.1701 477.875 31.5301 537.667 33.9868C597.459 36.6668 657.43 36.6668 717.222 30.6368C777.014 24.8301 836.986 12.7701 896.778 6.07013C956.57 -0.629868 1016.54 -1.96987 1076.33 4.28346C1136.13 10.5368 1196.1 24.8301 1255.89 26.1701C1315.68 27.7335 1375.65 16.5668 1435.44 18.1301C1495.24 19.4701 1555.21 33.7635 1585.01 40.6868L1615 47.8335V597.233H1585.01C1555.21 597.233 1495.24 597.233 1435.44 597.233C1375.65 597.233 1315.68 597.233 1255.89 597.233C1196.1 597.233 1136.13 597.233 1076.33 597.233C1016.54 597.233 956.57 597.233 896.778 597.233C836.986 597.233 777.014 597.233 717.222 597.233C657.43 597.233 597.459 597.233 537.667 597.233C477.875 597.233 417.903 597.233 358.111 597.233C298.319 597.233 238.348 597.233 178.556 597.233C118.764 597.233 58.792 597.233 28.9858 597.233H-1V9.86679Z"
						fill="#D2D3DB"
					/>
					<path
						d="M-1 119.3L28.9858 116.62C58.792 114.164 118.764 108.804 178.556 103.667C238.348 98.5302 298.319 93.1702 358.111 91.8302C417.903 90.2669 477.875 92.5002 537.667 95.4036C597.459 98.5302 657.43 102.104 717.222 105.23C777.014 108.134 836.986 110.367 896.778 114.387C956.57 118.63 1016.54 124.437 1076.33 127.787C1136.13 131.137 1196.1 132.03 1255.89 132.254C1315.68 132.7 1375.65 132.7 1435.44 133.37C1495.24 134.264 1555.21 135.604 1585.01 136.497L1615 137.167V597.233H1585.01C1555.21 597.233 1495.24 597.233 1435.44 597.233C1375.65 597.233 1315.68 597.233 1255.89 597.233C1196.1 597.233 1136.13 597.233 1076.33 597.233C1016.54 597.233 956.57 597.233 896.778 597.233C836.986 597.233 777.014 597.233 717.222 597.233C657.43 597.233 597.459 597.233 537.667 597.233C477.875 597.233 417.903 597.233 358.111 597.233C298.319 597.233 238.348 597.233 178.556 597.233C118.764 597.233 58.792 597.233 28.9858 597.233H-1V119.3Z"
						fill="#A6A9B8"
					/>
					<path
						d="M-1 224.266L28.9858 223.597C58.792 222.703 118.764 221.363 178.556 220.47C238.348 219.8 298.319 219.8 358.111 220.247C417.903 220.47 477.875 221.363 537.667 215.78C597.459 210.197 657.43 198.136 717.222 193.67C777.014 189.203 836.986 192.33 896.778 191.436C956.57 190.766 1016.54 186.3 1076.33 185.853C1136.13 185.63 1196.1 189.203 1255.89 195.68C1315.68 201.933 1375.65 210.866 1435.44 215.333C1495.24 219.8 1555.21 219.8 1585.01 219.8H1615V597.233H1585.01C1555.21 597.233 1495.24 597.233 1435.44 597.233C1375.65 597.233 1315.68 597.233 1255.89 597.233C1196.1 597.233 1136.13 597.233 1076.33 597.233C1016.54 597.233 956.57 597.233 896.778 597.233C836.986 597.233 777.014 597.233 717.222 597.233C657.43 597.233 597.459 597.233 537.667 597.233C477.875 597.233 417.903 597.233 358.111 597.233C298.319 597.233 238.348 597.233 178.556 597.233C118.764 597.233 58.792 597.233 28.9858 597.233H-1V224.266Z"
						fill="#7C8196"
					/>
					<path
						d="M-1 309.133L28.9858 308.687C58.792 308.463 118.764 307.57 178.556 304.667C238.348 301.763 298.319 296.403 358.111 295.733C417.903 295.063 477.875 298.637 537.667 295.733C597.459 292.83 657.43 283.003 717.222 282.333C777.014 281.663 836.986 289.703 896.778 294.17C956.57 298.637 1016.54 299.53 1076.33 299.53C1136.13 299.53 1196.1 298.637 1255.89 299.083C1315.68 299.53 1375.65 300.87 1435.44 301.763C1495.24 302.433 1555.21 302.433 1585.01 302.433H1615V597.233H1585.01C1555.21 597.233 1495.24 597.233 1435.44 597.233C1375.65 597.233 1315.68 597.233 1255.89 597.233C1196.1 597.233 1136.13 597.233 1076.33 597.233C1016.54 597.233 956.57 597.233 896.778 597.233C836.986 597.233 777.014 597.233 717.222 597.233C657.43 597.233 597.459 597.233 537.667 597.233C477.875 597.233 417.903 597.233 358.111 597.233C298.319 597.233 238.348 597.233 178.556 597.233C118.764 597.233 58.792 597.233 28.9858 597.233H-1V309.133Z"
						fill="#545B75"
					/>
					<path
						d="M-1 385.067L28.9858 382.387C58.792 379.93 118.764 374.57 178.556 375.464C238.348 376.134 298.319 382.833 358.111 384.62C417.903 386.63 477.875 383.503 537.667 381.27C597.459 379.037 657.43 377.697 717.222 377.25C777.014 376.803 836.986 377.697 896.778 380.6C956.57 383.503 1016.54 388.863 1076.33 386.853C1136.13 385.067 1196.1 376.133 1255.89 375.017C1315.68 373.9 1375.65 380.6 1435.44 383.503C1495.24 386.63 1555.21 385.737 1585.01 385.514L1615 385.067V597.233H1585.01C1555.21 597.233 1495.24 597.233 1435.44 597.233C1375.65 597.233 1315.68 597.233 1255.89 597.233C1196.1 597.233 1136.13 597.233 1076.33 597.233C1016.54 597.233 956.57 597.233 896.778 597.233C836.986 597.233 777.014 597.233 717.222 597.233C657.43 597.233 597.459 597.233 537.667 597.233C477.875 597.233 417.903 597.233 358.111 597.233C298.319 597.233 238.348 597.233 178.556 597.233C118.764 597.233 58.792 597.233 28.9858 597.233H-1V385.067Z"
						fill="#2C3856"
					/>
					<path
						d="M-1 478.867L28.9858 478.42C58.792 478.197 118.764 477.304 178.556 476.634C238.348 475.964 298.319 475.07 358.111 471.497C417.903 467.7 477.875 461 537.667 460.554C597.459 460.33 657.43 466.137 717.222 470.38C777.014 474.4 836.986 476.634 896.778 474.4C956.57 472.167 1016.54 465.467 1076.33 465.02C1136.13 464.797 1196.1 470.604 1255.89 471.05C1315.68 471.497 1375.65 466.137 1435.44 465.914C1495.24 465.467 1555.21 469.934 1585.01 472.167L1615 474.4V597.234H1585.01C1555.21 597.234 1495.24 597.234 1435.44 597.234C1375.65 597.234 1315.68 597.234 1255.89 597.234C1196.1 597.234 1136.13 597.234 1076.33 597.234C1016.54 597.234 956.57 597.234 896.778 597.234C836.986 597.234 777.014 597.234 717.222 597.234C657.43 597.234 597.459 597.234 537.667 597.234C477.875 597.234 417.903 597.234 358.111 597.234C298.319 597.234 238.348 597.234 178.556 597.234C118.764 597.234 58.792 597.234 28.9858 597.234H-1V478.867Z"
						fill="#001838"
					/>
				</svg>
			</div>
			<Footer />
			<Modal
				title={t('msg.see_links')}
				hideSubmitButton
				open={linksOpen}
				setOpen={setLinksOpen}
			>
				<div className="mt-3">
					<Link outsideLink openInNewTab to="https://lrima.cmaisonneuve.qc.ca/">
						{t('msg.section.lrima')}
					</Link>
				</div>
				<div className="mt-2">
					<Link to={routes.public.about.path}>{t('msg.section.about')}</Link>
				</div>
			</Modal>
		</StyledHome>
	);
};

export default Home;
