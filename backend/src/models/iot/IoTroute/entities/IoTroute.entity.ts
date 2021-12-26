import { Column, Entity, JoinTable, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { IoTProjectEntity } from '../../IoTproject/entities/IoTproject.entity';
import { AsScriptEntity } from '../../../as-script/entities/as-script.entity';

@Entity()
export class IoTRouteEntity {
  @PrimaryGeneratedColumn()
  @Exclude({ toClassOnly: true })
  id: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  @Length(2, 50)
  path: string;

  @ManyToOne(() => IoTProjectEntity, project => project.routes, { onDelete: 'CASCADE' })
  project: IoTProjectEntity;

  @ManyToOne(() => AsScriptEntity, { eager: true })
  @JoinTable({ name: 'asScriptId' })
  asScript?: AsScriptEntity;

  @Column({ name: 'asScriptId', nullable: true })
  @IsOptional()
  asScriptId?: string;
}
