import { Exclude } from 'class-transformer';
import { Entity, ManyToOne, TableInheritance, Column, OneToMany } from 'typeorm';
import { CreatedByUser } from '../../../generics/entities/createdByUser.entity';
import { ActivityChallengeEntity } from '../../course/entities/activities/activity_challenge.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { IsEmpty, IsNotEmpty, IsOptional } from 'class-validator';
import { ResourceChallengeEntity } from '../../resource/entities/resource_challenge.entity';

export enum CHALLENGE_TAG {}
export enum CHALLENGE_ACCESS {
  PUBLIC = 'PU', // can be found via a search
  UNLISTED = 'UN', // must be shared via a url
  RESTRICTED = 'RE', // limited to certain classes
  PRIVATE = 'PR', // only accessible to the creator
}

export enum CHALLENGE_DIFFICULTY {
  BEGINNER = 'BE',
  EASY = 'EA',
  MEDIUM = 'ME',
  ADVANCED = 'AD',
  HARD = 'HA',
  EXPERT = 'EX',
}

export enum CHALLENGE_TYPE {
  CODE = 'CO',
  ALIVE = 'AL',
  AI = 'AI',
  IOT = 'IOT',
}

@Entity()
@TableInheritance({ column: 'type' })
export class ChallengeEntity extends CreatedByUser {
  @Exclude({ toClassOnly: true })
  @ManyToOne(() => UserEntity, user => user.challenges, { eager: true, onDelete: 'SET NULL' })
  creator: UserEntity;

  @Column({ type: 'enum', enum: CHALLENGE_TYPE, default: CHALLENGE_TYPE.CODE, name: 'type' })
  @IsEmpty()
  readonly type: CHALLENGE_TYPE;

  @Column({ type: 'enum', enum: CHALLENGE_ACCESS, default: CHALLENGE_ACCESS.PRIVATE, nullable: false })
  @IsNotEmpty()
  access: CHALLENGE_ACCESS;

  @Column({ enum: CHALLENGE_DIFFICULTY, type: 'enum', nullable: true })
  @IsNotEmpty()
  difficulty: CHALLENGE_DIFFICULTY;

  @Column({ type: 'jsonb', default: () => "'[]'", nullable: false })
  @IsOptional()
  hints: string[] = [];

  @Column({ type: 'jsonb', default: [] })
  @IsOptional()
  tags: CHALLENGE_TAG[] = [];

  @OneToMany(() => ResourceChallengeEntity, res => res.challenge)
  resources: ActivityChallengeEntity;
}
