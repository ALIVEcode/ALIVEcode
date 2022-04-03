import { IsEmpty, IsNotEmpty, IsOptional } from "class-validator";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { CreatedByUser } from '../../../../generics/entities/createdByUser.entity';
import { IoTRouteEntity } from '../../IoTroute/entities/IoTroute.entity';
import { UserEntity } from '../../../user/entities/user.entity';
import { IoTLayoutManager } from '../IoTLayoutManager';
import { Type } from 'class-transformer';
import { IoTProjectObjectEntity } from './IoTprojectObject.entity';
import { ChallengeProgressionEntity } from '../../../challenge/entities/challenge_progression.entity';
import { AsScriptEntity } from '../../../as-script/entities/as-script.entity';

export enum IOTPROJECT_INTERACT_RIGHTS {
  ANYONE = 'AN',
  COLLABORATORS = 'CO',
  PRIVATE = 'PR',
}

export enum IOT_COMPONENT_TYPE {
  BUTTON,
  PROGRESS_BAR,
  LOGS,
  LED,
  LABEL,
}

export enum IOTPROJECT_ACCESS {
  PUBLIC = 'PU', // can be found via a search
  UNLISTED = 'UN', // must be shared via a url
  RESTRICTED = 'RE', // limited to certain classes
  PRIVATE = 'PR', // only accessible to the creator
}

export class IoTComponent {
  value: any;
  id: string;
  type: IOT_COMPONENT_TYPE;
}

export class IoTProjectLayout {
  @IsNotEmpty()
  @Type(() => IoTComponent)
  components: Array<IoTComponent>;
}

export type JsonObj = { [key: string]: any };

export type IoTProjectDocument = JsonObj;

@Entity()
export class IoTProjectEntity extends CreatedByUser {
  @ManyToOne(() => UserEntity, user => user.IoTProjects, { eager: true, onDelete: 'CASCADE' })
  @IsEmpty()
  creator: UserEntity;

  @ManyToOne(() => IoTProjectEntity, project => project.copied, { nullable: true })
  @JoinColumn({ name: 'originalId' })
  original?: IoTProjectEntity;

  @Column({ name: 'originalId', nullable: true })
  originalId?: string;

  @OneToMany(() => IoTProjectEntity, project => project.original)
  copied?: IoTProjectEntity[];

  // TODO : body typing
  @Column({ nullable: true, type: 'json', default: { components: [] } })
  @IsOptional()
  @Type(() => IoTProjectLayout)
  layout: IoTProjectLayout;

  @Column({ nullable: false, type: 'jsonb', default: {} })
  @IsOptional()
  document: IoTProjectDocument;

  @OneToOne(() => ChallengeProgressionEntity, progress => progress.challenge)
  progression?: ChallengeProgressionEntity;

  @OneToMany(() => AsScriptEntity, script => script.iotProject)
  scripts: AsScriptEntity[];

  @OneToMany(() => IoTProjectObjectEntity, obj => obj.iotProject)
  @JoinTable()
  @IsEmpty()
  iotProjectObjects: IoTProjectObjectEntity[];

  @Column({ type: 'enum', enum: IOTPROJECT_ACCESS, default: IOTPROJECT_ACCESS.PRIVATE })
  @IsNotEmpty()
  access: IOTPROJECT_ACCESS;

  @Column({ type: 'enum', enum: IOTPROJECT_INTERACT_RIGHTS, default: IOTPROJECT_INTERACT_RIGHTS.PRIVATE })
  @IsNotEmpty()
  interactRights: IOTPROJECT_INTERACT_RIGHTS;

  @ManyToMany(() => UserEntity, user => user.collabIoTProjects)
  @JoinTable()
  @IsEmpty()
  collaborators: UserEntity[];

  @OneToMany(() => IoTRouteEntity, route => route.project, { eager: true })
  @IsEmpty()
  routes: IoTRouteEntity[];

  getLayoutManager() {
    return new IoTLayoutManager(this.layout);
  }
}
