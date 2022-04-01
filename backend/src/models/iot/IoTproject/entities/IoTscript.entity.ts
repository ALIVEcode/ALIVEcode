import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';
import { IsEmpty, IsNotEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';
import { IoTProjectEntity } from './IoTproject.entity';
import { IoTProjectObjectEntity } from './IoTprojectObject.entity';

@Entity()
export class IoTScriptEntity {
  @PrimaryGeneratedColumn('increment')
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  @IsNotEmpty()
  name: string;

  @ManyToOne(() => IoTProjectEntity, project => project.iotScripts, { nullable: false })
  @IsEmpty()
  iotProject: IoTProjectEntity;

  @OneToOne(() => IoTProjectObjectEntity, object => object.iotScript)
  iotProjectObject?: IoTProjectObjectEntity;
}