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
import { ChallengeEntity } from '../../challenge/entities/challenge.entity';
import { IoTObjectEntity } from '../../iot/IoTobject/entities/IoTobject.entity';
import { IoTProjectEntity } from '../../iot/IoTproject/entities/IoTproject.entity';
import { ChallengeProgressionEntity } from '../../challenge/entities/challenge_progression.entity';
import { Post as Post_Table } from 'src/models/social/post/entities/post.entity';
import { Quiz } from 'src/models/social/quizzes/entities/quiz.entity';
import { Result } from 'src/models/social/results/entities/result.entity';
import { AsScriptEntity } from 'src/models/as-script/entities/as-script.entity';
import { CommentairesForum as Comment_Table } from 'src/models/social/commentaires-forum/entities/commentaires-forum.entity';
import Messages from 'src/models/social/messages/entities/messages.entity';
import { ChildEntity, ManyToMany } from 'typeorm';
import { CourseEntity } from '../../course/entities/course.entity';
import { ClassroomEntity } from '../../classroom/entities/classroom.entity';
import { Optional } from '@nestjs/common';
import { ResourceEntity } from '../../resource/entities/resource.entity';

export enum USER_TYPES {
  STUDENT = 'S',
  PROFESSOR = 'P',
}

@Entity()
@TableInheritance({ column: 'type' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude({ toClassOnly: true })
  id: string;

  @Column({ nullable: true })
  @IsNotEmpty()
  @Length(3, 25)
  @Matches(/^[-\p{L}]{3,}$/u, { message: 'form.firstName.error.match' })
  firstName: string;

  @Column({ nullable: true })
  @IsNotEmpty()
  @Length(3, 25)
  @Matches(/^[-\p{L}]{3,}$/u, { message: 'form.lastName.error.match' })
  lastName: string;

  @Exclude({ toClassOnly: true })
  @IsEmpty()
  @Column({ type: 'enum', enum: USER_TYPES, name: 'type', default: USER_TYPES.STUDENT })
  readonly type: USER_TYPES;

  @Column({ nullable: false })
  @Exclude({ toPlainOnly: true })
  @Length(6, 32)
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9!@#\\$&*~]*$/)
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

  @OneToMany(() => ChallengeEntity, challenge => challenge.creator, { cascade: true })
  challenges: ChallengeEntity[];

  @OneToMany(() => AsScriptEntity, asScript => asScript.creator)
  asScripts: AsScriptEntity[];

  @OneToMany(() => IoTObjectEntity, iot => iot.creator)
  IoTObjects: IoTObjectEntity[];

  @OneToMany(() => IoTProjectEntity, iot => iot.creator)
  IoTProjects: IoTProjectEntity[];

  @OneToMany(() => IoTProjectEntity, iot => iot.creator)
  collabIoTProjects: IoTProjectEntity[];

  @OneToMany(() => ChallengeProgressionEntity, prog => prog.user)
  challengeProgressions: ChallengeProgressionEntity[];

  @OneToMany(() => Post_Table, post => post.creator)
  post: Post_Table[];

  @OneToMany(() => Comment_Table, comment => comment.creator)
  comment: Comment_Table[];

  @OneToMany(() => Quiz, quiz => quiz.user)
  quiz: Quiz[];

  @OneToMany(() => Result, result => result.user, { cascade: true })
  result: Result[];

  @OneToMany(() => Messages, message => message.creator, { cascade: true })
  message: Messages[];

  @Column({ type: 'varchar', default: '' })
  image: string;
}

@ChildEntity(USER_TYPES.STUDENT)
export class StudentEntity extends UserEntity {
  @Column()
  @IsEmpty()
  oldStudentName: string;

  @Optional()
  @ManyToMany(() => ClassroomEntity, classroom => classroom.students, { onDelete: 'CASCADE' })
  classrooms: ClassroomEntity[];
}

@ChildEntity(USER_TYPES.PROFESSOR)
export class ProfessorEntity extends UserEntity {
  @Exclude({ toClassOnly: true })
  @OneToMany(() => ClassroomEntity, classroom => classroom.creator, { cascade: true })
  classrooms: ClassroomEntity[];

  @Exclude({ toClassOnly: true })
  @OneToMany(() => CourseEntity, course => course.creator, { cascade: true })
  courses: CourseEntity[];

  @Exclude({ toClassOnly: true })
  @OneToMany(() => ResourceEntity, resource => resource.creator)
  resources: ResourceEntity[];
}