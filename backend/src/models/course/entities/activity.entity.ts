import { Exclude, Type } from 'class-transformer';
import { IsEmpty, IsNotEmpty, Length } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, TableInheritance } from 'typeorm';
import { ActivityLevelEntity } from './activities/activity_level.entity';

export class ActivityContent {
  body: string;
}

export enum ACTIVIY_TYPE {
  VIDEO,
  THEORY,
  LEVEL,
}

@Entity()
@TableInheritance({ column: 'type' })
export class ActivityEntity {
  @PrimaryGeneratedColumn('increment')
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  id: number;

  @Exclude({ toClassOnly: true })
  @IsEmpty()
  @Column({ type: 'enum', name: 'type', enum: ACTIVIY_TYPE, default: ACTIVIY_TYPE.THEORY })
  readonly type: ACTIVIY_TYPE;

  @IsNotEmpty()
  @Column({ nullable: false })
  @Length(1, 100)
  name: string;

  @OneToMany(() => ActivityLevelEntity, actLevel => actLevel.activity)
  levels: ActivityLevelEntity[];
}