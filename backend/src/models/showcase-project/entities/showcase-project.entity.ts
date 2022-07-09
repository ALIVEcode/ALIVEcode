import { Column, PrimaryColumn, Entity } from 'typeorm';
import { SUBJECTS } from '../../../generics/types/sharedTypes';

@Entity()
export class ShowcaseProjectEntity {
  @PrimaryColumn({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ enum: SUBJECTS, type: 'enum', nullable: false })
  subject: SUBJECTS;

  @Column('text', { nullable: false, array: true })
  contributors: string[];

  @Column({ nullable: false })
  imgSrc?: string;

  @Column({ nullable: true })
  videoUrl?: string;

  @Column({ nullable: true })
  learnMoreUrl?: string;

  @Column({ type: 'timestamp', nullable: false })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  finishDate?: Date;
}
