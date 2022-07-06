import { ValidateIf, IsEnum, IsOptional } from 'class-validator';
import { SUBJECTS } from '../../../generics/types/sharedTypes';

export type FeaturingCoursesFrom = 'alivecode' | 'public' | 'both';

export class FeaturingQueryDTO {
  @IsEnum(SUBJECTS)
  @IsOptional()
  featuring?: SUBJECTS;

  @ValidateIf((val: any) => {
    return val === 'alivecode' || val === 'public' || val === 'both';
  })
  featuringFrom: FeaturingCoursesFrom;
}