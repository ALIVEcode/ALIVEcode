import { IsNotEmpty, IsEmpty } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CreatedByUser } from '../../../generics/entities/createdByUser.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { IoTProjectEntity } from '../../iot/IoTproject/entities/IoTproject.entity';

@Entity()
export class AsScriptEntity extends CreatedByUser {
  @ManyToOne(() => UserEntity, user => user.asScripts, { eager: true, onDelete: 'CASCADE' })
  creator: UserEntity;

  @IsNotEmpty()
  @Column()
  content: string;

  @ManyToOne(() => IoTProjectEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'iotProjectId' })
  @IsEmpty()
  iotProject?: IoTProjectEntity;

  @Column({ name: 'iotProjectId', type: 'varchar', nullable: true })
  iotProjectId?: string;
}
