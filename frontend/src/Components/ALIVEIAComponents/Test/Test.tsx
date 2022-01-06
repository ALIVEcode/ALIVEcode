import { useState, useEffect } from 'react';
import Button from '../../UtilsComponents/Buttons/Button';
import FillContainer from '../../UtilsComponents/FillContainer/FillContainer';
const Test = (props: any) => {
	const [chiffre, setChiffre] = useState(0);
	const [chiffre2, setChiffre2] = useState(0);
	useEffect(() => {
		console.log(4);
	}, [chiffre2]);
	return (
		<FillContainer centered>
			<Button variant=third onClick={() => setChiffre(chiffre + 1)}>
				Le bouton
			</Button>
			<label>{chiffre}</label>

			<button onClick={() => setChiffre2(chiffre2 + 1)}>Le bouton 2</button>
			<label>{chiffre2}</label>
		</FillContainer>
	);
};

export default Test;