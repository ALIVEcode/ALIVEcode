import { HomeProps } from './homeTypes';
import Footer from '../../Components/MainComponents/Footer/Footer';
import { useHistory } from 'react-router';
import { Container } from 'react-bootstrap';
import HomeCard from '../../Components/MainComponents/HomeCard/HomeCard';

import './home.css';

import Voiture from '../../assets/images/Voiture.gif';
import Cloud from '../../assets/images/cloud.png';
import Maze from '../../assets/images/Labyrinthe.jpg';
import LRIMA from '../../assets/images/LRIMA.png';
import TypeWriter from '../../Components/UtilsComponents/TypeWriter/TypeWriter';
import useRoutes from '../../state/hooks/useRoutes';
import { useTranslation } from 'react-i18next';

/**
 * Home page of ALIVEcode
 *
 * @author MoSk3
 */
const Home = (props: HomeProps) => {
	const history = useHistory();
	const { t } = useTranslation();
	const { routes } = useRoutes();

	return (
		<>
			<div className="header" style={{ top: '-50px' }}>
				<h1>ALIVEcode</h1>
				<TypeWriter
					lines={[t('home.msg1'), t('home.msg2'), t('home.msg3')]}
					typeSpeed={80}
					eraseSpeed={50}
					shadow
				/>

				<div id="arrow">
					<svg
						onClick={() => history.push(routes.auth.dashboard.path)}
						data-name="arrow"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
					>
						<g data-name="Arrow Left">
							<path
								style={{ fill: 'white' }}
								d="M7.77,23.58l-2.24-2a0.5,0.5,0,0,1,0-.71L13.43,12,5.5,3.13a0.5,0.5,0,0,1,0-.71l2.24-2a0.5,0.5,0,0,1,.71,0L18.8,12,8.48,23.54A0.5,0.5,0,0,1,7.77,23.58Z"
							/>
						</g>
					</svg>
				</div>
			</div>
			<Container>
				<Container fluid>
					<HomeCard
						title={t('home.section.alive.title')}
						content={t('home.section.alive.description')}
						to={routes.auth.dashboard.path}
						img={Voiture}
					/>
					<HomeCard
						title={t('home.section.amc.title')}
						content={t('home.section.amc.description')}
						to={routes.public.amc.path}
						img={Cloud}
					/>
					<HomeCard
						title={t('home.section.avp.title')}
						content={t('home.section.avp.description')}
						img={Maze}
					/>
					<HomeCard
						title={t('home.section.lrima.title')}
						content={t('home.section.lrima.description')}
						onClick={() =>
							window.open('https://lrima.cmaisonneuve.qc.ca/', '_blank')
						}
						img={LRIMA}
					/>
				</Container>
			</Container>
			<Footer />
		</>
	);
};

export default Home;