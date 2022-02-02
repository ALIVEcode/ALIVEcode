import { Exclude } from 'class-transformer';
import { IsEmpty, IsOptional } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { IoTProjectLayout } from '../../iot/IoTproject/entities/IoTproject.entity';
import { IoTLayoutManager } from '../../iot/IoTproject/IoTLayoutManager';
import { UserEntity } from '../../user/entities/user.entity';
import { LevelEntity } from './level.entity';

export type LevelAliveProgressionData = {
  code?: string;
};

export type LevelAIProgressionData = {
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
  | LevelAIProgressionData
  | LevelIoTProgressionData;

@Entity()
export class LevelProgressionEntity {
  @PrimaryGeneratedColumn()
  @IsEmpty()
  @Exclude({ toClassOnly: true })
  id: string;

  @ManyToOne(() => LevelEntity)
  @JoinColumn({ name: 'levelId' })
  @IsEmpty()
  level: LevelEntity;

  @Column({ nullable: false, name: 'levelId' })
  @Exclude()
  @IsEmpty()
  levelId: string;

  @Column({ type: 'json', default: () => "'{}'" })
  @IsOptional()
  data: LevelProgressionData;

  @ManyToOne(() => UserEntity, user => user.levelProgressions, { onDelete: 'CASCADE' })
  user: UserEntity;

  getLayoutManager(): null | IoTLayoutManager {
    if (!(this.data as any).layout) return null;
    return new IoTLayoutManager((this.data as LevelIoTProgressionData).layout);
  }
}
