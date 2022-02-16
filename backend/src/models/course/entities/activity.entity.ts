import { Exclude, Type } from 'class-transformer';
import { IsEmpty, IsNotEmpty, Length } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, TableInheritance } from 'typeorm';
import { ActivityLevelEntity } from './activity_level.entity';

export class ActivityContent {
  body: string;
}

export enum ACTIVIY_TYPE {
  VIDEO,
  THEORY,
  LEVEL,
}

@Entity()
@TableInheritance({ column: { type: 'enum', name: 'type', enum: ACTIVIY_TYPE } })
export class ActivityEntity {
  @PrimaryGeneratedColumn('increment')
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  id: number;

  @Exclude({ toClassOnly: true })
  @IsEmpty()
  type: ACTIVIY_TYPE;

  @IsNotEmpty()
  @Column({ nullable: false })
  @Length(1, 100)
  name: string;

  @Column({ type: 'json', default: {} })
  @Type(() => ActivityContent)
  content: ActivityContent;

  @OneToMany(() => ActivityLevelEntity, actLevel => actLevel.activity)
  levels: ActivityLevelEntity[];
}