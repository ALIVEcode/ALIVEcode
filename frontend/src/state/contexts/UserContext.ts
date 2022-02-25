import { createContext } from 'react';
import { User } from '../../Models/User/user.entity';
import { Maintenance } from '../../Models/Maintenance/maintenance.entity';
import { PlaySocket } from '../../Pages/Level/PlaySocket';

export const UserContext = createContext<{
	user: User | null;
	setUser: (user: User | null, doesForceUpdate?: boolean) => void;
	maintenance: Maintenance | null;
	playSocket: PlaySocket | null;
}>({ user: null, setUser: () => {}, maintenance: null, playSocket: null });
