import { ChildEntity, Column } from 'typeorm';
import { ChallengeEntity, CHALLENGE_TYPE } from '../challenge.entity';
import { IsOptional } from 'class-validator';

export enum CHALLENGE_RESOLUTION_MODE {
  ANY = 'ANY',
}

@ChildEntity(CHALLENGE_TYPE.CODE)
export class ChallengeCodeEntity extends ChallengeEntity {
  @Column({ type: 'enum', enum: CHALLENGE_RESOLUTION_MODE, default: CHALLENGE_RESOLUTION_MODE.ANY })
  @IsOptional()
  resolution: CHALLENGE_RESOLUTION_MODE;

  @Column({ nullable: true })
  @IsOptional()
  initialCode?: string;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  @IsOptional()
  testCases: string;

  @Column({ nullable: true })
  @IsOptional()
  solution?: string;
}