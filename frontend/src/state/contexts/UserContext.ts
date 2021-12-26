import { createContext } from "react";
import { Student, Professor } from '../../Models/User/user.entity';
import { Maintenance } from '../../Models/Maintenance/maintenance.entity';
import { PlaySocket } from '../../Pages/Level/PlaySocket';

export const UserContext = createContext<{
	user: Professor | Student | null;
	setUser: (user: Professor | Student | null) => void;
	maintenance: Maintenance | null;
	playSocket: PlaySocket | null;
}>({ user: null, setUser: () => {}, maintenance: null, playSocket: null });