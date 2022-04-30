import { createContext } from 'react';
import { User } from '../../Models/User/user.entity';
import { Maintenance } from '../../Models/Maintenance/maintenance.entity';
import { PlaySocket } from '../../Pages/Challenge/PlaySocket';
import { Resource, RESOURCE_TYPE } from '../../Models/Resource/resource.entity';
import { MenuResourceCreationDTO } from '../../Components/Resources/MenuResourceCreation/menuResourceCreationTypes';
import { ResourceMenuSubjects } from '../../Pages/ResourceMenu/resourceMenuTypes';

export type UserContextValues = {
	user: User | null;
	setUser: (user: User | null, doesForceUpdate?: boolean) => void;
	maintenance: Maintenance | null;
	playSocket: PlaySocket | null;
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
		filters?: RESOURCE_TYPE[],
	) => Promise<Resource[]>;
};

export const UserContext = createContext<UserContextValues>({
	user: null,
	setUser: () => {},
	maintenance: null,
	playSocket: null,
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
