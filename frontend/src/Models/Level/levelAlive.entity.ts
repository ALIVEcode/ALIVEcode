import { Level } from "./level.entity";
import { BaseLayoutObj } from '../../Components/LevelComponents/Simulation/Sketch/simulation/ts/typesSimulation';

export enum LEVEL_RESOLUTION_MODE {
	ANY = 'ANY',
}

export class LevelAlive extends Level {
	layout: BaseLayoutObj[];
	initialCode?: string;
	resolution: LEVEL_RESOLUTION_MODE;
	solution?: string;
}
