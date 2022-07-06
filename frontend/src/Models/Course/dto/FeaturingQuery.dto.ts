import { SUBJECTS } from '../../../Types/sharedTypes';

export type FeaturingCoursesFrom = 'alivecode' | 'public' | 'both';

export class FeaturingQueryDTO {
	featuring?: SUBJECTS;
	featuringFrom: FeaturingCoursesFrom;
}
