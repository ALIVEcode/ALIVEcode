import { useEffect, useState } from 'react';
import axios from 'axios';

const AccountPageDemo = () => {
	const [user, setUser] = useState<any>();

	useEffect(() => {
		const getUser = async () => {
			setUser((await axios.get('/users/me')).data);
		};
		getUser();
	}, []);

	return (
		<div className="bg-[color:var(--bg-shade-two-color)]">
			<div>Account</div>
			<br />
			{user && (
				<div>
					Hello {user.firstName}
					<br />
					<br />
					Your email address: <strong>{user.email}</strong>
				</div>
			)}
		</div>
	);
};

export default AccountPageDemo;
