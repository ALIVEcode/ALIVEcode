import { useState, useEffect, useContext } from 'react';
import api from '../../Models/api';
import { Resource } from '../../Models/Resource/resource.entity';
import { UserContext } from '../../state/contexts/UserContext';

const ResourcesMenu = () => {
	const [resources, setResources] = useState<Resource[]>([]);
	const { user } = useContext(UserContext);

	useEffect(() => {
		if (!user) return;
		const getResources = async () => {
			setResources(await api.db.users.getResources({ id: user.id }));
		};
		getResources();
	}, [user]);

	return (
		<div>
			{resources.map((r, idx) => (
				<div className="p-4 bg-[color:var(--background-color)] text-lg">
					{r.name}
				</div>
			))}
		</div>
	);
};

export default ResourcesMenu;
