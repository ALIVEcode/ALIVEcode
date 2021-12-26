import { IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CreatedByUser } from '../../../generics/entities/createdByUser.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity()
export class AsScriptEntity extends CreatedByUser {
  @ManyToOne(() => UserEntity, user => user.asScripts, { eager: true, onDelete: 'CASCADE' })
  creator: UserEntity;

  @IsNotEmpty()
  @Column()
  content: string;
}
