import { IoTProjectLayout } from "../Iot/IoTproject.entity";

export type LevelAliveProgressionData = {
	code?: string;
};

export type LevelCodeProgressionData = {
	code?: string;
};

export type LevelIoTProgressionData = {
	layout?: IoTProjectLayout;
	code?: string;
};

export type LevelProgressionData =
	| LevelAliveProgressionData
	| LevelCodeProgressionData
	| LevelIoTProgressionData;

export class LevelProgression {
	id: string;

	levelId: string;

	data: LevelProgressionData;
}
