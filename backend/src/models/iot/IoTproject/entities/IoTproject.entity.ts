import { IsEmpty, IsNotEmpty, IsOptional } from "class-validator";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { CreatedByUser } from '../../../../generics/entities/createdByUser.entity';
import { IoTRouteEntity } from '../../IoTroute/entities/IoTroute.entity';
import { UserEntity } from '../../../user/entities/user.entity';
import { IoTObjectEntity } from '../../IoTobject/entities/IoTobject.entity';
import { IoTLayoutManager } from '../IoTLayoutManager';

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

type IoTComponent = {
  value: any;
  id: string;
  type: IOT_COMPONENT_TYPE;
};

export class IoTProjectLayout {
  @IsNotEmpty()
  components: Array<IoTComponent>;
}

@Entity()
export class IoTProjectEntity extends CreatedByUser {
  @ManyToOne(() => UserEntity, user => user.IoTProjects, { eager: true, onDelete: 'CASCADE' })
  @IsEmpty()
  creator: UserEntity;

  // TODO : body typing
  @Column({ nullable: true, type: 'json', default: { components: [] } })
  @IsOptional()
  layout: IoTProjectLayout;

  @ManyToMany(() => IoTObjectEntity, obj => obj.iotProjects)
  @JoinTable()
  @IsEmpty()
  iotObjects: IoTObjectEntity[];

  @Column({ enum: IOTPROJECT_ACCESS })
  @IsNotEmpty()
  access: IOTPROJECT_ACCESS;

  @Column({ enum: IOTPROJECT_INTERACT_RIGHTS })
  @IsNotEmpty()
  interactRights: IOTPROJECT_INTERACT_RIGHTS;

  @ManyToMany(() => UserEntity, user => user.collabIoTProjects)
  @JoinColumn()
  @IsEmpty()
  collaborators: UserEntity[];

  @OneToMany(() => IoTRouteEntity, route => route.project, { eager: true })
  @IsEmpty()
  routes: IoTRouteEntity[];

  getLayoutManager() {
    return new IoTLayoutManager(this.layout);
  }
}
