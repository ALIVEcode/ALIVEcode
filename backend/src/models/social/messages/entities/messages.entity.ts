import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from "src/models/user/entities/user.entity";
import { CreatedByUser } from 'src/generics/entities/createdByUser.entity';
 
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