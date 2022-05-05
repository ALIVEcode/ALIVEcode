import { Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, Entity } from 'typeorm';
import { IsNotEmpty, MaxLength } from 'class-validator';

@Entity()
export class AIDatasetEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  @IsNotEmpty()
  @MaxLength(300)
  name: string;

  @Column({ type: 'json', nullable: false })
  data: object;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
