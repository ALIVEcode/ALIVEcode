import CenteredContainer from '../../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import CardContainer from '../../../Components/UtilsComponents/CardContainer/CardContainer';
import SmallCard from '../../../Components/UtilsComponents/Cards/SmallCard/SmallCard';

const QuizHome = () => {

	return (
		<div>
			<CenteredContainer
				horizontally
				textAlign="center"
				style={{ paddingLeft: '250px', paddingRight: '250px' }}
			>
				<CardContainer asRow style={{ marginBottom: '100px' }} title="Quiz">
					<SmallCard to="/quiz/category/1" title="IoT" />
					<SmallCard to="/quiz/category/2" title="Base de données" />
					<SmallCard to="/quiz/category/3" title="Pseudocode" />
					<SmallCard to="/quiz/category/4" title="Réseaux" />
				</CardContainer>
			</CenteredContainer>
		</div>
	);
};

export default QuizHome;