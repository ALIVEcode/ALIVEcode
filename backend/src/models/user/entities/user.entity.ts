import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsEmpty, IsNotEmpty, Length, Matches } from 'class-validator';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
  CreateDateColumn,
} from 'typeorm';
import { LevelEntity } from '../../level/entities/level.entity';
import { IoTObjectEntity } from '../../iot/IoTobject/entities/IoTobject.entity';
import { IoTProjectEntity } from '../../iot/IoTproject/entities/IoTproject.entity';
import { LevelProgressionEntity } from '../../level/entities/levelProgression.entity';
import { Post as Post_Table } from "src/models/social/post/entities/post.entity";
import { Quiz } from 'src/models/social/quizzes/entities/quiz.entity';
import { Result } from 'src/models/social/results/entities/result.entity';
import { AsScriptEntity } from 'src/models/as-script/entities/as-script.entity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude({ toClassOnly: true })
  id: string;

  @Column({ nullable: false })
  @Exclude({ toPlainOnly: true })
  @Length(6, 32)
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9!@#\$&*~]*$/)
  password: string;

  @Column({ unique: true, nullable: false })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ default: false })
  @IsEmpty()
  @Exclude({ toClassOnly: true })
  @Expose({ groups: ['admin', 'user'] })
  isMod: boolean;

  @Column({ default: false })
  @IsEmpty()
  @Exclude({ toClassOnly: true })
  @Expose({ groups: ['admin', 'user'] })
  isAdmin: boolean;

  @Column({ default: false })
  @IsEmpty()
  @Exclude({ toClassOnly: true })
  @Expose({ groups: ['admin', 'user'] })
  isSuperUser: boolean;

  @CreateDateColumn()
  @Exclude({ toClassOnly: true })
  joinDate: Date;

  @OneToMany(() => LevelEntity, level => level.creator, { cascade: true })
  levels: LevelEntity[];

  @OneToMany(() => AsScriptEntity, asScript => asScript.creator)
  asScripts: AsScriptEntity[];

  @OneToMany(() => IoTObjectEntity, iot => iot.creator)
  IoTObjects: IoTObjectEntity[];

  @OneToMany(() => IoTProjectEntity, iot => iot.creator)
  IoTProjects: IoTProjectEntity[];

  @OneToMany(() => IoTProjectEntity, iot => iot.creator)
  collabIoTProjects: IoTProjectEntity[];

  @OneToMany(() => LevelProgressionEntity, prog => prog.user)
  levelProgressions: LevelProgressionEntity[];

  @OneToMany(() => Post_Table, post => post.user_id)
  post: Post_Table[];

  @OneToMany(() => Quiz, quiz => quiz.user_id)
  quiz: Quiz[];

  @OneToMany(() => Result, result => result.user_id)
  result: Result[];
  @Column({type:'varchar', default: ""})
  avatar : string;
} 