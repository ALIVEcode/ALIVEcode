import { useState, useEffect, useContext } from 'react';
import ResourceCard from '../../Components/Resources/ResourceCard/ResourceCard';
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
		<div className="w-full h-full flex flex-row bg-[color:var(--background-color)]">
			<div className="w-1/6 flex flex-col border-r border-[color:var(--bg-shade-four-color)]">
				<div className="h-20 border-b border-[color:var(--bg-shade-four-color)]">
					YO
				</div>
			</div>
			<div className="flex flex-col w-full h-full">
				<div className="h-20 border-b border-[color:var(--bg-shade-four-color)]">
					YO
				</div>
				<div className="w-full h-full grid grid-cols-1 phone:grid-cols-2 tablet:grid-cols-4 laptop:grid-cols-6 desktop:grid-cols-7 gap-4 p-4">
					{resources.map((r, idx) => (
						<ResourceCard resource={r} key={idx} />
					))}
				</div>
			</div>
		</div>
	);
};

export default ResourcesMenu;
