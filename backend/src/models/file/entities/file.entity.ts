import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsEmpty, IsNotEmpty } from 'class-validator';
import { ResourceEntity } from 'src/models/resource/entities/resource.entity';

/**
 * File model in the database
 * @author Maxime Gazze
 */
@Entity()
export class FileEntity {
  /** Id of the resource */
  @PrimaryGeneratedColumn('uuid')
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  id: string;

  /** Creation date of the resource */
  @CreateDateColumn()
  @IsEmpty()
  creationDate: Date;

  /** Creation date of the resource */
  @Column()
  @IsNotEmpty()
  originalname: string;

  /** Encoding type of the file */
  @Column()
  @IsNotEmpty()
  encoding: string;

  /** Mime type of the file */
  @Column()
  @IsNotEmpty()
  mimetype: string;

  /** Size of the file in bytes */
  @Column({ type: 'bigint' })
  @IsNotEmpty()
  size: number;

  /** The folder to which the file has been saved */
  @Column()
  @IsNotEmpty()
  destination: string;

  /** The name of the file within the destination */
  @Column()
  @IsNotEmpty()
  filename: string;

  /** The full path to the uploaded file */
  @Column()
  @IsNotEmpty()
  path: string;
}
