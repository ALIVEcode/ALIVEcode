import { ChallengeEntity, CHALLENGE_TYPE } from "../challenge.entity";
import { Column, ChildEntity } from 'typeorm';
import { IsOptional } from 'class-validator';

export enum CHALLENGE_RESOLUTION_MODE {
  ANY = 'ANY',
}

@ChildEntity(CHALLENGE_TYPE.ALIVE)
export class ChallengeAliveEntity extends ChallengeEntity {
  @Column({ type: 'json', default: () => "'{}'" })
  @IsOptional()
  layout: string;

  @Column({ nullable: true })
  @IsOptional()
  initialCode?: string;

  @Column({ type: 'enum', enum: CHALLENGE_RESOLUTION_MODE, default: CHALLENGE_RESOLUTION_MODE.ANY })
  @IsOptional()
  resolution: CHALLENGE_RESOLUTION_MODE;

  @Column({ nullable: true })
  @IsOptional()
  solution?: string;
}
