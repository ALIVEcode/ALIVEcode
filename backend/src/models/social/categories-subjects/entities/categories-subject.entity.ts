import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Subject } from "../../subjects/entities/subject.entity";

@Entity()
export class CategoriesSubject {
    @PrimaryGeneratedColumn()
    id : number;

    @Column('varchar')
    name : string;

    @OneToMany(() => Subject, subject => subject.category, { eager: true })
    subjects: Subject[];

}