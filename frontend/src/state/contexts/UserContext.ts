import { createContext } from 'react';
import { User } from '../../Models/User/user.entity';
import { Maintenance } from '../../Models/Maintenance/maintenance.entity';
import { PlaySocket } from '../../Pages/Challenge/PlaySocket';
import { Resource } from '../../Models/Resource/resource.entity';

export const UserContext = createContext<{
	user: User | null;
	setUser: (user: User | null, doesForceUpdate?: boolean) => void;
	maintenance: Maintenance | null;
	playSocket: PlaySocket | null;
	resources: Resource[] | null;
	setResources: (res: Resource[]) => void;
}>({
	user: null,
	setUser: () => {},
	maintenance: null,
	playSocket: null,
	resources: null,
	setResources: () => {},
});
