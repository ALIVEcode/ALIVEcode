import { Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, Entity } from 'typeorm';
import { IsNotEmpty, MaxLength } from 'class-validator';

/**
 * AIDataset entity inside the database. Used to store data used to train or test a model.
 */
@Entity()
export class AIDatasetEntity {
  /** Id of the dataset */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Name of the dataset */
  @Column({ type: 'varchar', nullable: false })
  @IsNotEmpty()
  @MaxLength(300)
  name: string;

  /** Data stored inside the dataset */
  @Column({ type: 'json', nullable: false })
  data: object;

  /** Creation date of the dataset */
  @CreateDateColumn()
  createDate: Date;

  /** Update date of the dataset */
  @UpdateDateColumn()
  updateDate: Date;
}
