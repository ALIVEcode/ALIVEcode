import { IoTProjectLayout } from '../Iot/IoTproject.entity';

export type ChallengeAliveProgressionData = {
	code?: string;
};

export type ChallengeCodeProgressionData = {
	code?: string;
};

export type ChallengeIoTProgressionData = {
	layout?: IoTProjectLayout;
	code?: string;
};

export type ChallengeProgressionData =
	| ChallengeAliveProgressionData
	| ChallengeCodeProgressionData
	| ChallengeIoTProgressionData;

export class ChallengeProgression {
	id: string;

	challengeId: string;

	data: ChallengeProgressionData;
}
