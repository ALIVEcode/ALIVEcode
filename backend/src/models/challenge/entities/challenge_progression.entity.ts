import { Exclude } from 'class-transformer';
import { IsEmpty, IsOptional } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { IoTProjectLayout } from '../../iot/IoTproject/entities/IoTproject.entity';
import { IoTLayoutManager } from '../../iot/IoTproject/IoTLayoutManager';
import { UserEntity } from '../../user/entities/user.entity';
import { ChallengeEntity } from './challenge.entity';

export type ChallengeAliveProgressionData = {
  code?: string;
};

export type ChallengeAIProgressionData = {
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
  | ChallengeAIProgressionData
  | ChallengeIoTProgressionData;

@Entity()
export class ChallengeProgressionEntity {
  @PrimaryGeneratedColumn()
  @IsEmpty()
  @Exclude({ toClassOnly: true })
  id: string;

  @ManyToOne(() => ChallengeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'challengeId' })
  @IsEmpty()
  challenge: ChallengeEntity;

  @Column({ nullable: false, name: 'challengeId' })
  @Exclude()
  @IsEmpty()
  challengeId: string;

  @Column({ type: 'json', default: () => "'{}'" })
  @IsOptional()
  data: ChallengeProgressionData;

  @ManyToOne(() => UserEntity, user => user.challengeProgressions, { onDelete: 'CASCADE' })
  user: UserEntity;

  getLayoutManager(): null | IoTLayoutManager {
    if (!(this.data as any).layout) return null;
    return new IoTLayoutManager((this.data as ChallengeIoTProgressionData).layout);
  }
}
