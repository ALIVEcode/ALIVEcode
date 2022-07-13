import { createContext } from 'react';
import { User } from '../../Models/User/user.entity';
import { Maintenance } from '../../Models/Maintenance/maintenance.entity';
import { Resource } from '../../Models/Resource/resource.entity';
import { MenuResourceCreationDTO } from '../../Components/Resources/MenuResourceCreation/menuResourceCreationTypes';
import { ResourceMenuSubjects } from '../../Pages/ResourceMenu/resourceMenuTypes';
import { UserSocket } from '../sockets/userSocket/userSocket';

export type UserContextValues = {
	user: User | null;
	setUser: (user: User | null, doesForceUpdate?: boolean) => void;
	maintenance: Maintenance | null;
	userSocket: UserSocket | null;
	resources: Resource[];
	setResourceCreationMenuOpen: (state: boolean) => void;
	updateResource: <T>(
		defaultResource: Resource,
		newResource: Omit<T, keyof Resource> | MenuResourceCreationDTO,
	) => Promise<Resource>;
	createResource: (
		dto: MenuResourceCreationDTO,
		progressSetter?: React.Dispatch<React.SetStateAction<number>>,
	) => Promise<Resource>;
	deleteResource: (resource: Resource) => void;
	getResources: (
		subject: ResourceMenuSubjects,
		name?: string | undefined,
		filters?: string[],
	) => Promise<Resource[]>;
};

export const UserContext = createContext<UserContextValues>({
	user: null,
	setUser: () => {},
	maintenance: null,
	userSocket: null,
	resources: [],
	setResourceCreationMenuOpen: () => {},
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	updateResource: async function <Resource>() {
		return new Resource();
	},
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	createResource: async function () {
		return new Resource();
	},
	deleteResource: () => {},
	getResources: async () => [],
});
