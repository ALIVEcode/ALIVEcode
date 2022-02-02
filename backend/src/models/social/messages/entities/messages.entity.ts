import { Column, Entity, ManyToOne} from 'typeorm';
import { CreatedByUser } from '../../../../generics/entities/createdByUser.entity';
import { UserEntity } from '../../../user/entities/user.entity';

@Entity()
class Message extends CreatedByUser {
  @ManyToOne(() => UserEntity, user => user.message, { eager: true, onDelete: 'SET NULL' })
  creator: UserEntity;

  @Column()
  public content: string;

  @ManyToOne(() => UserEntity)
  public author: UserEntity;
}

export default Message;