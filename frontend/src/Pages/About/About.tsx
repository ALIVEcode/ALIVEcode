import { AboutProps } from './aboutTypes';
import CardContainer from '../../Components/UtilsComponents/CardContainer/CardContainer';
import { useTranslation } from 'react-i18next';
import AboutCard from '../../Components/UtilsComponents/Cards/AboutCard/AboutCard';
import CenteredContainer from '../../Components/UtilsComponents/CenteredContainer/CenteredContainer';

import Jihene from '../../assets/images/creators/Jihene.jpg';
import Enric from '../../assets/images/creators/Enric.jpg';
import Mathis from '../../assets/images/creators/Mathis.jpg';
import Zarine from '../../assets/images/creators/Zarine.jpg';
import Felix from '../../assets/images/creators/Felix.jpg';
import Pablo from '../../assets/images/creators/Pablo.jpg';
import Brian from '../../assets/images/creators/Brian.jpg';
import Younes from '../../assets/images/simulation/obstacles/water.jpg';
import Hamza from '../../assets/images/creators/Hamza.jpg';
import Eloi from '../../assets/images/creators/Eloi.jpg';
import Gabriel from '../../assets/images/creators/Gabriel.jpg';
import Simon from '../../assets/images/creators/Simon.jpg';
import Guillaume from '../../assets/images/creators/Guillaume.jpg';
import Emile from '../../assets/images/creators/Emile.jpg';
import styled from 'styled-components';

const StyledCenteredContainer = styled(CenteredContainer)`
	padding: 0 10% 0 10%;

	.row-prof {
		margin-top: 10px;
		margin-bottom: 10px;
	}
`;

/**
 * About page that shows all the members that contributed on the ALIVE project
 *
 * @author MoSk3
 */
const About = (props: AboutProps) => {
	const { t } = useTranslation();

	return (
		<div className="p-10">
			<CardContainer titleSize="1.2em" title={t('msg.section.about')}>
				<div>
					<AboutCard
						className="row-prof"
						name="Dre. Jihene Rezgui directrice de LRIMa"
						img={Jihene}
					/>
				</div>
				<div className="grid phone:grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4">
					<AboutCard name="Enric Soldevila" img={Enric} />
					<AboutCard name="Mathis Laroche" img={Mathis} />
					<AboutCard name="Zarine Ardekani" img={Zarine} />
					<AboutCard name="Félix Jobin" img={Felix} />
					<AboutCard name="Pablo Cabale" img={Pablo} />
					<AboutCard name="Brian-José Mejia-Rivera" img={Brian} />
					<AboutCard name="Younes Kechout" img={Younes} />
					<AboutCard name="Hamza Bellahsen" img={Hamza} />
					<AboutCard name="Eloi Vincent-Légaré" img={Eloi} />
					<AboutCard name="Gabriel Landry" img={Gabriel} />
					<AboutCard name="Simon Beaulieu" img={Simon} />
					<AboutCard name="Guillaume Blain" img={Guillaume} />
					<AboutCard name="Émile Gagné" img={Emile} />
				</div>
			</CardContainer>
		</div>
	);
};

export default About;