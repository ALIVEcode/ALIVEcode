import { ChallengeEntity, CHALLENGE_TYPE } from "../challenge.entity";
import { Column, ChildEntity } from 'typeorm';
import { IsOptional, IsEmpty } from 'class-validator';

@ChildEntity(CHALLENGE_TYPE.AI)
export class ChallengeAIEntity extends ChallengeEntity {
  @Column({ nullable: true })
  @IsOptional()
  initialCode?: string;

  @Column({ nullable: true })
  @IsOptional()
  solution?: string;

  @Column({ nullable: true, default: 'ai' })
  @IsEmpty()
  ai: string;
}
