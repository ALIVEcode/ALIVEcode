import './NotFound.css';
import Link from '../../../Components/MainComponents/Link/Link';

import VoitureGIF from "../../../assets/images/Voiture.gif";
import FillContainer from '../../../Components/MiscComponents/FillContainer/FillContainer';
import { useHistory } from 'react-router';
import useRoutes from '../../../state/hooks/useRoutes';

export const NotFound = () => {

	const history = useHistory();
	const { public_routes } = useRoutes();

	return (
		<FillContainer style={{ textAlign: 'center' }} startAtTop centered>
			<div>
				<h1>Désolé.</h1>
				<h2>Cette page n'existe pas.</h2>
				<img
					src={VoitureGIF} alt="Voiture ALIVE"
				/>
				<div>
					<Link onClick={() => history.goBack()} dark bold>Retour en arrière.</Link>
					<br />
					<br />
					<Link to={public_routes.home.path} bold>Retour à la page d'accueil.</Link>
				</div>
			</div>
		</FillContainer>
	)
}