import { ChildEntity, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ChallengeEntity } from '../../challenge/entities/challenge.entity';
import { ResourceEntity, RESOURCE_TYPE } from './resource.entity';
import { ActivityChallengeEntity } from '../../course/entities/activities/activity_challenge.entity';
import { IsNotEmpty } from 'class-validator';

/**
 * Activity of type Challenge model in the database
 * @author Enric Solevila
 */
@ChildEntity(RESOURCE_TYPE.CHALLENGE)
export class ResourceChallengeEntity extends ResourceEntity {
  /** Reference to the challenge to display */
  @ManyToOne(() => ChallengeEntity, challenge => challenge.resources)
  @JoinColumn({ name: 'challengeId' })
  challenge: ChallengeEntity;

  /** Id of the referenced challenge */
  @Column({ type: 'uuid', name: 'challengeId' })
  @IsNotEmpty()
  challengeId: string;
}