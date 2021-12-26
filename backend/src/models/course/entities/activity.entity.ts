import { Exclude, Type } from 'class-transformer';
import { IsEmpty, IsNotEmpty, Length } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ActivityLevelEntity } from './activity_level.entity';

export class ActivityContent {
  body: string;
}

@Entity()
export class ActivityEntity {
  @PrimaryGeneratedColumn('increment')
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  id: number;

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