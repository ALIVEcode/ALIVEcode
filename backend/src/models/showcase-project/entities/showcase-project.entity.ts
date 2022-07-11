import { Column, PrimaryColumn, Entity } from 'typeorm';
import { SUBJECTS } from '../../../generics/types/sharedTypes';
import { Exclude } from 'class-transformer';

@Entity()
export class ShowcaseProjectEntity {
  @PrimaryColumn({ nullable: false, unique: true })
  nameId: string;

  @Column({ type: 'json', default: { en: 'English title', fr: 'French title' }, nullable: false })
  name: {
    en: string;
    fr: string;
  };

  @Column({ type: 'json', default: { en: 'English description', fr: 'Description française' }, nullable: false })
  description: {
    en: string;
    fr: string;
  };

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

  @Column({ default: false, nullable: false })
  ongoing?: boolean;

  @Column({ type: 'date', nullable: false })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  finishDate?: Date;

  @Column({ default: 0, nullable: false })
  @Exclude()
  featuringScore: number;
}
