import { HomeProps, StyledHome } from './homeTypes';
import Footer from '../../Components/MainComponents/Footer/Footer';
import VoitureAnimee from '../../assets/images/Voiture.gif';
import TypeWriter from '../../Components/UtilsComponents/TypeWriter/TypeWriter';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect } from 'react';
import { ThemeContext } from '../../state/contexts/ThemeContext';

/**
 * Home page of ALIVEcode
 *
 * @author MoSk3
 */
const Home = (props: HomeProps) => {
	const { t } = useTranslation();
	const { theme } = useContext(ThemeContext);

	useEffect(() => {
		const oldOverflow = document.body.style.overflowX;
		document.body.style.overflowX = 'hidden';

		return () => {
			document.body.style.overflowX = oldOverflow || 'auto';
		};
	}, []);

	return (
		<StyledHome className="bg-[color:var(--background-color)]">
			<div className="header" style={{ top: '-50px' }}>
				<div>
					<label className="header-alive">ALIVE</label>
					<label className="header-desc">
						<TypeWriter
							lines={[t('home.msg1'), t('home.msg2'), t('home.msg3')]}
							typeSpeed={200}
							eraseSpeed={150}
							delayAfterWrite={3000}
							delayAfterErase={500}
							shadow
							startWithText
						/>
					</label>
				</div>
				<label className="header-lore">Learn Programming</label>
			</div>
			<svg
				className="curve"
				viewBox="0 0 1616 215"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M1920 0H0V119.542C0 119.542 638 -39.3132 866 140C1094 319.313 1920 119.542 1920 119.542V0Z"
					fill={theme.color.primary}
				/>
			</svg>
			<nav className="flex flex-row gap-5 w-full px-20 text-xl">
				<div>About</div>
				<div>Trainings</div>
				<div>News</div>
			</nav>
			<Footer />
			<div className="header-circle">
				<img alt="alive-car" src={VoitureAnimee} />
			</div>
		</StyledHome>
	);
};

export default Home;
