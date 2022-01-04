import { useState, useContext } from 'react';
import { UserContext } from '../../state/contexts/UserContext';
import useRoutes from '../../state/hooks/useRoutes';
import Button from '../../Components/UtilsComponents/Button/Button';
import { useNavigate } from 'react-router-dom';

const Test = () => {
	const [number, setNumber] = useState(0);
	const { user } = useContext(UserContext);
	const { routes } = useRoutes();
	const navigate = useNavigate();

	return (
		<div>
			<label>{number}</label>
			<Button variant="danger" onClick={() => setNumber(number + 1)}>
				Click
			</Button>
			{user ? <div>{user.getDisplayName()}</div> : <div>Not connected</div>}
			<Button
				onClick={() => navigate(routes.auth.account.path)}
				variant="third"
			></Button>
			{routes.public.test.path}
		</div>
	);
};

export default Test;
